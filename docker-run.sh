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
if [[ ! -z "$EXPORTING_PDF" ]]; then
  echo "  \"exportingPDF\": \"$EXPORTING_PDF\"," >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$COVERAGE_DISPLAY_TYPE" ]]; then
  echo "  \"coverageDisplayType\": \"$COVERAGE_DISPLAY_TYPE\"," >> /usr/share/nginx/html/assets/config.json
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
