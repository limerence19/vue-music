export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    }
}

const VKEY = 'BD6D099152D778ABA1DACF6C326271F69E90AFF773F5457FDEA939FB6353C47C93E56C774FF69D068F400D6B53D8AC772FBB09966A0A25E0'

export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // 播放源的变化, guid是实时的
        url: `http://ws.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${VKEY}&guid=426177710&uin=0&fromtag=66`
    })
}

function filterSinger(singer) {
    let ret = [];
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/');
}