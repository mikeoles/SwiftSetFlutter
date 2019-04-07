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
if [[ ! -z "$API_TYPE" ]]; then
  echo "  \"apiType\": \"$API_TYPE\"," >> /usr/share/nginx/html/assets/config.json
else
  echo "  \"apiType\": odata" >> /usr/share/nginx/html/assets/config.json
fi
echo "  \"production\": true" >> /usr/share/nginx/html/assets/config.json
echo "}" >> /usr/share/nginx/html/assets/config.json

if [[ "$API_TYPE" = "static" ]]; then
  sed -i '/api.*/,+3d'  /etc/nginx/conf.d/default.conf
fi

if [[ ! -z "$USER_NAME" ]] && [[ ! -z "$PASSWORD_HASH" ]]; then
  echo "$USER_NAME:$PASSWORD_HASH" >> /etc/nginx/conf.d/nginx_auth.htpasswd
  sed -i "/try_files/a\\\tauth_basic \"Restricted Content\";\n\tauth_basic_user_file /etc/nginx/conf.d/nginx_auth.htpasswd;" /etc/nginx/conf.d/default.conf
fi

echo "Using config:"
cat /usr/share/nginx/html/assets/config.json

nginx -g "daemon off;"
