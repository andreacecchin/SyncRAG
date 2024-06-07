package synclab.ragprototype.repository;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import static synclab.ragprototype.utils.Utils.DATABASE_PATH;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class EmbeddingRepository {

      private InMemoryEmbeddingStore<TextSegment> embeddingStore;

      @Autowired
      public EmbeddingRepository(InMemoryEmbeddingStore<TextSegment> embeddingStore) {
            this.embeddingStore = embeddingStore;
      }

      public List<EmbeddingMatch<TextSegment>> findEmbedding(Embedding embedding, int maxResults, double minScore) {
            return embeddingStore.findRelevant(embedding, maxResults, minScore);
      }

      public String getDocuments() {
            return embeddingStore.serializeToJson();
      }

      public String addDocument(List<Embedding> embeddings, List<TextSegment> segments) {
            try {
                  embeddingStore.addAll(embeddings, segments);
                  embeddingStore.serializeToFile(DATABASE_PATH);
                  return "Document added correctly.";
            } catch (Exception e) {
                  return "Error adding file.";
            }
      }

      public String deleteDocument(String toDelete) {
            try {
                  embeddingStore = InMemoryEmbeddingStore.fromJson(toDelete);
                  embeddingStore.serializeToFile(DATABASE_PATH);
                  return "Document deleted correctly.";
            } catch (Exception e) {
                  return "Error deleting file.";
            }

      }

}