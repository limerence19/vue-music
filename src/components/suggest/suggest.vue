<template>
    <scroll 
        class="suggest" 
        :data="result" 
        :pullup="pullup" 
        :beforeScroll="beforeScroll"
        @beforeScroll="listScroll"
        @scrollToEnd="searchMore" 
        ref="suggest"
    > 
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>

        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
import { search } from 'api/search';
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song';
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex';
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer';

export default {
    data() {
        return {
            result: [],
            page: 1,
            pullup: true,
            beforeScroll: true,
            hasMore: true
        }
    },

    components: {
        Scroll,
        Loading,
        NoResult
    },

    props: {
        query: {
            type: String,
            default: ''
        },

        showSinger: {
            type: Boolean,
            default: true
        }
    },

    watch: {
        query() {
            this.search();
        }
    },

    methods: {
        search() {
            // reset action
            this.page = 1;
            this.hasMore = true;
            this.$refs.suggest.scrollTo(0, 0);

            search(this.query, this.page, this.showSinger).then((res) => {
                if (res.data.code === ERR_OK) {
                    this.result = this.genResult(res.data.data);
                    this.checkMore(res.data.data)
                }
            })
        },

        searchMore() {
            if (!this.hasMore) return;
            this.page++;
            search(this.query, this.page, this.showSinger).then((res) => {
                if (res.data.code === ERR_OK) {
                    this.result = this.result.concat(this.genResult(res.data.data));
                    this.checkMore(res.data.data)
                }
            })
        },

        checkMore(data) {
            const song = data.song;
            if (!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
                this.hasMore = false;
            }
        },

        selectItem(item) {
            if (item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                });

                this.$router.push({
                    path: `/search/${singer.id}`
                });

                this.setSinger(singer);
            } else {
                this.insertSong(item);
            }

            this.$emit('select');
        },

        genResult(data) {
            let ret = [];
            if (data.zhida && data.zhida.singerid) {
                ret.push({
                    ...data.zhida,
                    type: TYPE_SINGER
                });
            }

            if (data.song) {
                ret = ret.concat(this.normalizeSongs(data.song.list));
            }
            return ret;
        },

        normalizeSongs(list) {
            let ret = [];
            list.forEach((musicData) => {
                if (musicData.songid && musicData.albumid) {
                    ret.push(createSong(musicData))
                }
            })
            return ret;
        },

        getIconCls(item) {
            if (item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },

        getDisplayName(item) {
            if (item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name}-${item.singer}`
            }
        },

        refresh() {
            this.$refs.suggest.refresh();
        },

        listScroll() {
            this.$emit('listScroll');
        },

        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),

        ...mapActions({
            insertSong: 'insertSong'
        })
    }
}
</script>

<style lang="less" scoped>
  @import "~common/styles/variable.less";
  @import "~common/styles/mixin.less";

  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: @color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text {
          .no-wrap();
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>