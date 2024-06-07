package synclab.ragprototype.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.vertexai.VertexAiGeminiChatModel;
import dev.langchain4j.model.vertexai.VertexAiChatModel;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartFile;
import synclab.ragprototype.repository.EmbeddingRepository;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import dev.langchain4j.store.embedding.EmbeddingMatch;

import static dev.langchain4j.data.document.loader.FileSystemDocumentLoader.loadDocument;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.*;

import static dev.langchain4j.model.openai.OpenAiChatModelName.GPT_3_5_TURBO;
import static java.util.stream.Collectors.joining;
import static synclab.ragprototype.utils.Utils.toPath;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RagService {

    private final EmbeddingRepository embeddingRepository;

    @Autowired
    public RagService(EmbeddingRepository embeddingRepository) {
        this.embeddingRepository = embeddingRepository;
    }

    public String answerQuestion(String question, String model) {

        EmbeddingModel embeddingModel = new AllMiniLmL6V2EmbeddingModel();
        Embedding questionEmbedding = embeddingModel.embed(question).content();
        int maxResults = 5;
        double minScore = 0.65;
        List<EmbeddingMatch<TextSegment>> relevantEmbeddings
                = embeddingRepository.findEmbedding(questionEmbedding, maxResults, minScore);
        PromptTemplate promptTemplate = PromptTemplate.from(
                """
                        Answer to the following question, based ONLY on the context i'll give you.

                        Question:---
                        {{question}}
                        ---

                        Context:---
                        {{information}}
                        ---

                        ONLY IF you have no useful information you MUST answer with 'I can't provide any answer.'. Don't use general knowledge to give information outside the context.
                        """);
        String information = relevantEmbeddings.stream()
                .map(match -> match.embedded().text())
                .collect(joining("\n--\n"));
        Map<String, Object> variables = new HashMap<>();
        variables.put("question", question);
        variables.put("information", information);
        Prompt prompt = promptTemplate.apply(variables);
        ChatLanguageModel chatModel = null;

        if ("GPT3.5".equals(model)) {
            chatModel = OpenAiChatModel.builder()
                    .apiKey("demo")
                    .modelName(GPT_3_5_TURBO)
                    .temperature(0.6)
                    .build();
        } else if ("Gemini".equals(model)) {
            chatModel = VertexAiGeminiChatModel.builder()
                    .project("gemini-synclab-proj")
                    .location("us-central1")
                    .modelName("gemini-1.5-pro-preview-0514")
                    .temperature(0.6F)
                    .build();
        } else if ("PaLM2".equals(model)) {
            chatModel = VertexAiChatModel.builder()
                    .project("gemini-synclab-proj")
                    .location("us-central1")
                    .modelName("chat-bison")
                    .publisher("google")
                    .endpoint("us-central1-aiplatform.googleapis.com:443")
                    .temperature(0.6)
                    .build();
        } else {
            chatModel = OllamaChatModel.builder()
                    .baseUrl("http://localhost:11434")
                    .modelName("phi3")
                    .temperature(0.6)
                    .timeout(Duration.ofMinutes(1))
                    .build();
        }

        AiMessage aiMessage = chatModel.generate(prompt.toUserMessage()).content();
        return aiMessage.text();
    }

    public List<String> getDocuments() {
        String embeddingStoreString = embeddingRepository.getDocuments();
        List<String> storedDocuments = new ArrayList<>();
        JSONObject jsonObject = new JSONObject(embeddingStoreString);
        JSONArray entries = jsonObject.getJSONArray("entries");

        for (int i = 0; i < entries.length(); i++) {
            JSONObject entry = entries.getJSONObject(i);
            JSONObject embedded = entry.getJSONObject("embedded");
            JSONObject metadata = embedded.getJSONObject("metadata");
            JSONObject innerMetadata = metadata.getJSONObject("metadata");
            String fileName = innerMetadata.getString("file_name");

            if (!storedDocuments.contains(fileName)) {
                storedDocuments.add(fileName);
            }
        }

        return storedDocuments;
    }

    public String addDocument(MultipartFile newDocument){
        try {
            deleteDocument(newDocument.getOriginalFilename());
            File resourceDirectory = new ClassPathResource("documents").getFile();
            String uploadDir = resourceDirectory.getAbsolutePath() + "/";
            File destination = new File(uploadDir + newDocument.getOriginalFilename());
            newDocument.transferTo(destination);
            Document document = loadDocument(toPath("documents/" + newDocument.getOriginalFilename()), new ApachePdfBoxDocumentParser());
            DocumentSplitter splitter = new DocumentByParagraphSplitter(
                    700,
                    100
            );
            List<TextSegment> segments = splitter.split(document);
            EmbeddingModel embeddingModel = new AllMiniLmL6V2EmbeddingModel();
            List<Embedding> embeddings = embeddingModel.embedAll(segments).content();
            return embeddingRepository.addDocument(embeddings, segments);
        } catch (IOException e) {
            //e.printStackTrace();
            return "Error adding file.";
        }
    }

    public String deleteDocument(String toDelete) {
        try {
            File resourceDirectory = new ClassPathResource("documents").getFile();
            File documentFile = new File(resourceDirectory.getAbsolutePath() + "/" + toDelete);
            if (documentFile.exists()) {
                documentFile.delete();
            }
        } catch (IOException e) {
            //e.printStackTrace();
            return "Error deleting file.";
        }
        String embeddingStoreString = embeddingRepository.getDocuments();
        JSONObject jsonObject = new JSONObject(embeddingStoreString);
        JSONArray entries = jsonObject.getJSONArray("entries");
        JSONArray updatedEntries = new JSONArray();

        for (int i = 0; i < entries.length(); i++) {
            JSONObject entry = entries.getJSONObject(i);
            JSONObject embedded = entry.getJSONObject("embedded");
            JSONObject metadata = embedded.getJSONObject("metadata");
            JSONObject innerMetadata = metadata.getJSONObject("metadata");
            String fileName = innerMetadata.getString("file_name");

            if (!fileName.equals(toDelete)) {
                updatedEntries.put(entry);
            }
        }

        JSONObject updatedJson = new JSONObject();
        updatedJson.put("entries", updatedEntries);
        String newEmbeddingStoreString = updatedJson.toString();
        return embeddingRepository.deleteDocument(newEmbeddingStoreString);
    }

}