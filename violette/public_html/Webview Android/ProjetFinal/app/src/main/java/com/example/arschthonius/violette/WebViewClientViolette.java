package com.example.arschthonius.violette;

import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class WebViewClientViolette extends WebViewClient {

	public boolean shouldOverrideUrlLoading(WebView view, String url) {
		Log.i("WebViewClient ", url);
		return false;
	}

	public void onReceivedError(WebView view, int errorCode,
			String description, String failingUrl) {
		Log.i("WebViewClient Error", failingUrl + " : " + description);
	}

	public void onLoadResource(WebView view, String url) {
		Log.i("WebViewClient Load", url);
	}
}
