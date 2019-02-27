echo "Starting web app"

echo "{" > /usr/share/nginx/html/assets/config.json
if [[ ! -z "$DEMO_API_URL" ]]; then
  echo "  \"apiUrl\": \"$DEMO_API_URL\"" >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$EXPORT_FIELDS" ]]; then
  echo "  \"exportFields\": [$EXPORT_FIELDS]" >> /usr/share/nginx/html/assets/config.json
fi
if [[ ! -z "$PRODUCT_GRID_FIELDS" ]]; then
  echo "  \"productGridFields\": [$PRODUCT_GRID_FIELDS]" >> /usr/share/nginx/html/assets/config.json
fi
echo "}" >> /usr/share/nginx/html/assets/config.json

echo "Using config:"
cat /usr/share/nginx/html/assets/config.json

nginx -g "daemon off;"
