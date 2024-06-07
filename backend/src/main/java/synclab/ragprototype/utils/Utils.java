package synclab.ragprototype.utils;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Utils {

    public static String DATABASE_PATH = "src/main/resources/database/embedding.json";
    public static String ADMIN_USERNAME = "admin";

    public static Path toPath(String fileName) {
        URL fileUrl = Utils.class.getClassLoader().getResource(fileName);
        if (fileUrl == null) {
            throw new RuntimeException("File " + fileName + " not found");
        }
        try {
            return Paths.get(fileUrl.toURI());
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

}
