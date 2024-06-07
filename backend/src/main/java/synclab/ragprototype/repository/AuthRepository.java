package synclab.ragprototype.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import synclab.ragprototype.model.Credential;

public interface AuthRepository extends JpaRepository<Credential, String> {
    Credential findByUsername(String username);
}