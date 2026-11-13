import java.net.*;

public class SettingHeadersToAConnection {
    public void headers(String[][] pairs, HttpURLConnection conn){
        for(String[] pair: pairs){
            if(pair.length != 2) continue;
            conn.setRequestProperty(pair[0], pair[1]);
        }
    }

    public void header(String[] pair, HttpURLConnection conn){
        conn.setRequestProperty(pair[0], pair[1]);
    }
}