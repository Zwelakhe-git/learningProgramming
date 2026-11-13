
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;


public class Form {
    private Map<String, String> fields;

    Form(){
        this.fields = new HashMap<>();
    }

    public void set(String key, String value){
        this.fields.put(key, URLEncoder.encode(value, StandardCharsets.UTF_8));
    }

    public void remove(String key){
        this.fields.remove(key);
    }

    public Map<String, String> getFields(){
        return this.fields;
    }
}
