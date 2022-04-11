url="https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v="
for i in $(cat urls.txt); do
    i=${i%$'\r'}
    content="$(curl -s -o /dev/null -I -w "%{http_code}\n" "$url$i")"
    if [[ "$content" != "200" ]]
    then
        echo "$i"
    fi
done