package synclab.ragprototype.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import synclab.ragprototype.service.AuthService;
import synclab.ragprototype.service.RagService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api")
public class Controller {

    private final RagService ragService;
    private final AuthService authService;

    @Autowired
    public Controller(RagService ragService, AuthService authService) {
        this.ragService = ragService;
        this.authService = authService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/ask")
    public String askQuestion(@RequestParam String question, @RequestParam String model) {
        return ragService.answerQuestion(question, model);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/documents")
    public List<String> getDocuments() {
        return ragService.getDocuments();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/documents")
    public String addDocument(@RequestParam("file") MultipartFile newDocument) {
        return ragService.addDocument(newDocument);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/documents")
    public String deleteDocument(@RequestParam String toDelete) {
        return ragService.deleteDocument(toDelete);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/auth")
    public ResponseEntity<Boolean> auth(@RequestBody String password) {
        if (authService.checkCredential(password)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }
}
