docker volume create --name ${FROM_VOLUME}

docker run --rm -it -v ${FROM_VOLUME}$:/from -v ${TO_VOLUME}:/to busybox

cd /from ; cp -av . /to
