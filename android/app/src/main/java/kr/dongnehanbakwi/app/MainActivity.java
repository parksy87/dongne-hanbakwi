package kr.dongnehanbakwi.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow()
                .getDecorView()
                .post(
                        () -> {
                            enableWebViewStorage();
                        });
    }

    private void enableWebViewStorage() {
        try {
            Bridge bridge = getBridge();
            if (bridge == null) {
                return;
            }

            WebView webView = bridge.getWebView();
            if (webView == null) {
                return;
            }

            WebSettings settings = webView.getSettings();
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
        } catch (Exception ignored) {
            // Bridge/WebView may not be ready yet on some devices.
        }
    }
}
