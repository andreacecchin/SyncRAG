package synclab.ragprototype.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import synclab.ragprototype.model.Credential;
import synclab.ragprototype.repository.AuthRepository;

import static synclab.ragprototype.utils.Utils.ADMIN_USERNAME;

@Service
public class AuthService {

    private final AuthRepository authRepository;

    @Autowired
    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public boolean checkCredential(String password) {
        Credential credential = authRepository.findByUsername(ADMIN_USERNAME);
        String passwordAdmin = credential.getPassword();
        return new BCryptPasswordEncoder().matches(password,passwordAdmin);
    }

}
