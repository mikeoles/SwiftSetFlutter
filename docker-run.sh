echo "Starting web app"

echo "{" > /usr/share/nginx/html/assets/config.json
if [[ ! -z "$DEMO_API_URL" ]]; then
  echo "  \"apiUrl\": \"$DEMO_API_URL\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$EXPORT_FIELDS" ]]; then
  echo "  \"exportFields\": [$EXPORT_FIELDS]," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$PRODUCT_GRID_FIELDS" ]]; then
  echo "  \"productGridFields\": [$PRODUCT_GRID_FIELDS]," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$ON_HAND" ]]; then
  echo "  \"onHand\": \"$ON_HAND\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$SHOW_EXPORT_BUTTONS" ]]; then
  echo "  \"showExportButtons\": $SHOW_EXPORT_BUTTONS," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$COVERAGE_DISPLAY_TYPE" ]]; then
  echo "  \"coverageDisplayType\": \"$COVERAGE_DISPLAY_TYPE\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$DISPLAY_COVERAGE" ]]; then
  echo "  \"coveragePercent\": $DISPLAY_COVERAGE," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$SHOW_TOP_STOCK" ]]; then
  echo "  \"showTopStock\": \"$SHOW_TOP_STOCK\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$SHOW_SECTION_LABELS" ]]; then
  echo "  \"showSectionLabels\": \"$SHOW_SECTION_LABELS\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$SHOW_SECTION_BREAK" ]]; then
  echo "  \"showSectionBreak\": \"$SHOW_SECTION_BREAK\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$SHOW_MISREAD_BARCODES" ]]; then
  echo "  \"showMisreadBarcodes\": $SHOW_MISREAD_BARCODES," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$AUTH_URL" ]]; then
  echo "  \"authUrl\": \"$AUTH_URL\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$AUTH_CLIENT_ID" ]]; then
  echo "  \"authClientId\": \"$AUTH_CLIENT_ID\"," >> /usr/share/nginx/html/assets/config.json
fi
echo "  \"production\": true" >> /usr/share/nginx/html/assets/config.json
echo "}" >> /usr/share/nginx/html/assets/config.json

if [[ ! -z "$USER_NAME" ]] && [[ ! -z "$PASSWORD_HASH" ]]; then
  echo "$USER_NAME:$PASSWORD_HASH" >> /etc/nginx/conf.d/nginx_auth.htpasswd
  sed -i "/try_files/a\\\tauth_basic \"Restricted Content\";\n\tauth_basic_user_file /etc/nginx/conf.d/nginx_auth.htpasswd;" /etc/nginx/conf.d/default.conf
fi

echo "Using config:"
cat /usr/share/nginx/html/assets/config.json

nginx -g "daemon off;"
