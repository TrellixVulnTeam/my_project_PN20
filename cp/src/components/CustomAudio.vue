<template>
  <div class="CustomAudio">
    <a-row type="flex" justify="space-between" align="bottom">
      <a-col :span="4" align="center">
        <audio ref="Raudio"></audio>
        <a-space :size="size">
          <a-button type="primary" icon="backward" @click="PrevClick" />
          <a-button
            type="primary"
            :icon="
              playState == PLAYSTATE.PAUSE || playState == PLAYSTATE.NONE
                ? 'play-circle'
                : 'pause-circle'
            "
            @click="PlayClick"
          />
          <a-button type="primary" icon="forward" @click="NextClick" />
        </a-space>
      </a-col>
      <a-col :span="13" align="center">
        <a-row>
          <a-col :span="24" align="left">
            <div class="lyric">
              <a-space :size="size">
                <a-tooltip placement="topLeft" :title="musicInfo.title">
                  <span>{{ musicInfo.title | titleEllipsis }}</span>
                </a-tooltip>
                <a-tooltip placement="topLeft" :title="musicInfo.lrc">
                  <span>{{ musicInfo.lrc | lyricEllipsis }}</span>
                </a-tooltip>
              </a-space>
            </div>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" align="middle">
          <a-col :span="17" align="left">
            <a-slider
              class="progressBar"
              :value="songProgress"
              @change="SongProgressChange"
            />
          </a-col>
          <a-col :span="6" align="left">
            <div class="time">
              <span>{{ getCurrentTimeStr() + "/" + getDurationStr() }}</span>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="7" align="center">
        <a-space :size="size">
          <a-button type="primary" @click="SoundClick">
            <IconFont
              :type="
                audio.volume == 0 ? 'icon-shengyinjingyin' : 'icon-shengyin'
              "
            ></IconFont>
          </a-button>
          <a-slider
            class="soundSlider"
            :value="audio.volume"
            @change="SoundChange"
          />
          <a-button type="primary" @click="LoopPlaybackClick">
            <IconFont
              :type="
                loopState == REPEATSTATE.REPEAT_ALL
                  ? 'icon-24gl-repeat2'
                  : loopState == REPEATSTATE.SHUFFLE
                  ? 'icon-suiji'
                  : 'icon-danquxunhuan'
              "
            ></IconFont>
          </a-button>
          <a-button type="primary" icon="container" @click="ContainerClick" />
        </a-space>
      </a-col>
    </a-row>
    <a-drawer
      :title="$t('language.SongList')"
      placement="right"
      :mask="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
      :width="360"
    >
      <a-list
        item-layout="horizontal"
        :data-source="musicList"
        size="small"
        bordered
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-list-item-meta>
            <a-button slot="title" type="link" @click="PlayListClick(index)">{{
              item.title
            }}</a-button>
            <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
            <span slot="description"
              >{{ $t("language.Artist") }}:{{ item.artist }}</span
            >
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-drawer>
  </div>
</template>

<script>
import IconFont from "@/utils/IconFont";
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "CustomAudio",
  components: {
    IconFont,
  },
  data: function () {
    return {
      size: "small",
      visible: false,
    };
  },
  filters: {
    titleEllipsis(value) {
      if (!value) return "";
      var len = 15;
      if (value.length > len) {
        return value.slice(0, len) + "...";
      }
      return value;
    },
    lyricEllipsis(value) {
      if (!value) return "";
      var len = 55;
      if (value.length > len) {
        return value.slice(0, len) + "...";
      }
      return value;
    },
  },
  watch: {
    "audio.volume": function (newVal) {
      this.$refs.Raudio.volume = newVal / 100;
      if (newVal == 0) {
        this.$refs.Raudio.muted = true;
        this.setAudioByKey({
          muted: true,
        });
      } else {
        this.$refs.Raudio.muted = false;
        this.setAudioByKey({
          muted: false,
        });
      }
    },
  },
  computed: {
    ...mapGetters("AudioStore", {
      getAudioByKey: "getAudioByKey",
      getMusicInfoByKey: "getMusicInfoByKey",
      getMusicListByIndex: "getMusicListByIndex",
      getCurrentTimeStr: "getCurrentTimeStr",
      getDurationStr: "getDurationStr",
      getPlayIndex: "getPlayIndex",
      getMusicInfo: "getMusicInfo",
      getPrevPlayIndex: "getPrevPlayIndex",
      getNextPlayIndex: "getNextPlayIndex",
    }),
    ...mapState("AudioStore", {
      REPEATSTATE: "REPEATSTATE",
      PLAYSTATE: "PLAYSTATE",
      playState: "playState",
      loopState: "loopState",
      audio: "audio",
      musicInfo: "musicInfo",
      musicList: "musicList",
      playIndex: "playIndex",
    }),
    songProgress: {
      get: function () {
        if (this.getAudioByKey("duration") == 0) {
          return 0;
        }
        return (
          (this.getAudioByKey("currentTime") / this.getAudioByKey("duration")) *
          100
        );
      },
      set(val) {
        var currentTime = (val / 100) * this.getAudioByKey("duration");
        this.setAudioByKey({ currentTime: currentTime });
        this.$refs.Raudio.currentTime = currentTime;
      },
    },
  },
  created: function () {
    this.resetState();
  },
  mounted() {
    this.initAudio();
    this.setMusicListAction("api/Song").then(() => {
      this.setMusicInfo(this.getMusicInfo);
      this.$refs.Raudio.src = this.getMusicInfoByKey("src");
      if (this.getAudioByKey("autoplay")) {
        this.play();
      }
    });
  },
  methods: {
    ...mapMutations("AudioStore", {
      resetState: "resetState",
      setPlayState: "setPlayState",
      setLoopState: "setLoopState",
      setAudio: "setAudio",
      setMusicInfo: "setMusicInfo",
      setAudioByKey: "setAudioByKey",
      setMusicInfoByKey: "setMusicInfoByKey",
      setMusicList: "setMusicList",
      addMusicInToList: "addMusicInToList",
      setPlayIndex: "setPlayIndex",
    }),
    ...mapActions("AudioStore", {
      setMusicListAction: "setMusicListAction",
    }),
    initAudio() {
      this.$refs.Raudio.controls = this.getAudioByKey(
        "shouldShowNativeControls"
      );
      this.$refs.Raudio.muted = this.getAudioByKey("muted");
      this.$refs.Raudio.preload = this.getAudioByKey("preload");
      this.$refs.Raudio.volume = this.getAudioByKey("volume") / 100;

      const mediaEvents = [
        "abort",
        "canplay",
        "canplaythrough",
        "durationchange",
        "emptied",
        "encrypted",
        "ended",
        "error",
        "interruptbegin",
        "interruptend",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "mozaudioavailable",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "seeked",
        "seeking",
        "stalled",
        "suspend",
        "timeupdate",
        "volumechange",
        "waiting",
      ];
      mediaEvents.forEach((event) => {
        this.$refs.Raudio.addEventListener(event, (e) => this.$emit(event, e));
      });

      this.$refs.Raudio.addEventListener("abort", this.onAudioAbort);
      this.$refs.Raudio.addEventListener("play", this.onAudioPlay);
      this.$refs.Raudio.addEventListener("pause", this.onAudioPause);
      this.$refs.Raudio.addEventListener("abort", this.onAudioPause);
      this.$refs.Raudio.addEventListener("waiting", this.onAudioWaiting);
      this.$refs.Raudio.addEventListener("canplay", this.onAudioCanplay);
      this.$refs.Raudio.addEventListener("progress", this.onAudioProgress);
      this.$refs.Raudio.addEventListener(
        "durationchange",
        this.onAudioDurationChange
      );
      this.$refs.Raudio.addEventListener("seeking", this.onAudioSeeking);
      this.$refs.Raudio.addEventListener("seeked", this.onAudioSeeked);
      this.$refs.Raudio.addEventListener("timeupdate", this.onAudioTimeUpdate);
      this.$refs.Raudio.addEventListener(
        "loadedmetadata",
        this.onLoadedmetadata
      );
      this.$refs.Raudio.addEventListener(
        "volumechange",
        this.onAudioVolumeChange
      );
      this.$refs.Raudio.addEventListener("ended", this.onAudioEnded);
      this.$refs.Raudio.addEventListener("error", this.onError);

      // if (this.musicInfo) {
      //   this.$refs.Raudio.src = this.getMusicInfoByKey("src");
      // }
    },
    //在音频/视频(audio/video)终止加载时触发。
    onAudioAbort(res) {
      console.log("onAudioAbort", res);
    },
    // 当音频开始播放
    onAudioPlay(res) {
      console.log("onAudioPlay", res);
      this.setPlayState(this.PLAYSTATE.PLAY);
      this.setAudioByKey({ isPlaying: true });
      const target = res.target;
      const audios = document.getElementsByTagName("audio");
      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause();
        }
      });
      console.log("onAudioPlay", [...audios]);
    },
    // 当音频暂停
    onAudioPause(res) {
      console.log("onAudioPause", res);
      if (this.playState !== this.PLAYSTATE.NONE) {
        this.setAudioByKey({ isPlaying: false });
      }
      this.setPlayState(this.PLAYSTATE.PAUSE);
    },
    // 当发生错误, 就出现loading状态
    onError(res) {
      console.log("onError", res);
      this.$error({
        title: "onError",
        content: res,
      });
      this.setAudioByKey({ isLoading: true });
    },
    // 当音频开始等待
    onAudioWaiting(res) {
      console.log("onAudioWaiting", res);
      this.setAudioByKey({ isLoading: true });
    },
    //当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件。
    onAudioCanplay(res) {
      console.log("onAudioCanplay", res);
      this.setAudioByKey({ isLoading: false });
      if (
        this.getAudioByKey("isPlaying") == true &&
        this.playState !== this.PLAYSTATE.PLAY
      ) {
        this.$refs.Raudio.play();
      }
    },
    //当浏览器正在下载指定的音频/视频时，会发生 progress 事件
    onAudioProgress(res) {
      console.log("onAudioProgress", res);
    },
    //当指定音频/视频的时长数据发生变化时，发生 durationchange 事件。
    onAudioDurationChange(res) {
      console.log("onAudioDurationChange", res);
      this.setAudioByKey({ duration: res.target.duration });
    },
    //在用户开始移动/跳跃到新的音频/视频（audio/video）播放位置时触发。
    onAudioSeeking(res) {
      console.log("onAudioSeeking", res);
    },
    //用户已移动/跳跃到音频/视频（audio/video）中的新位置时触发
    onAudioSeeked(res) {
      console.log("onAudioSeeked", res);
      this.setAudioByKey({ currentTime: res.target.currentTime });
    },
    onAudioTimeUpdate: function (res) {
      if (res.target.seeking == false) {
        this.setAudioByKey({ currentTime: res.target.currentTime });
      }
    },
    onLoadedmetadata: function (res) {
      console.log("onLoadedmetadata", res);
      this.setAudioByKey({ duration: res.target.duration });
    },
    onAudioVolumeChange(res) {
      console.log("onAudioVolumeChange", res);
    },
    onAudioEnded(res) {
      console.log("onAudioEnded", res);
      // determine next song according to shuffle and repeat
      this.setPlayState(this.PLAYSTATE.NONE);
      var index = this.getPlayIndex;
      this.setPlayIndex(index);
      this.setMusicInfo(this.getMusicInfo);
      this.$refs.Raudio.src = this.getMusicInfoByKey("src");
      this.play();
    },
    // 播放音频
    play() {
      if (this.$refs.Raudio.readyState == 4) {
        this.$refs.Raudio.play();
      } else {
        this.setAudioByKey({ isPlaying: true });
      }
      console.log("play", this.getAudioByKey("isPlaying"));
    },
    // 暂停音频
    pause() {
      this.$refs.Raudio.pause();
    },
    PrevClick: function () {
      console.log("上一首");
      this.setPlayState(this.PLAYSTATE.NONE);
      this.pause();
      var index = this.getPrevPlayIndex;
      this.setPlayIndex(index);
      this.setMusicInfo(this.getMusicInfo);
      this.$refs.Raudio.src = this.getMusicInfoByKey("src");
      this.play();
    },
    PlayClick: function () {
      if (this.playState == this.PLAYSTATE.PLAY) {
        this.pause();
      } else {
        this.play();
      }
    },
    PlayListClick: function (index) {
      this.setPlayState(this.PLAYSTATE.NONE);
      this.pause();
      this.setPlayIndex(index);
      this.setMusicInfo(this.getMusicInfo);
      this.$refs.Raudio.src = this.getMusicInfoByKey("src");
      this.play();
    },
    NextClick: function () {
      console.log("下一首");
      this.setPlayState(this.PLAYSTATE.NONE);
      this.pause();
      var index = this.getNextPlayIndex;
      this.setPlayIndex(index);
      this.setMusicInfo(this.getMusicInfo);
      this.$refs.Raudio.src = this.getMusicInfoByKey("src");
      this.play();
    },
    SoundClick: function () {
      this.audio.volume = this.audio.volume == 0 ? 50 : 0;
    },
    SoundChange: function (e) {
      this.audio.volume = e;
    },
    LoopPlaybackClick: function () {
      if (this.loopState == this.REPEATSTATE.REPEAT_ALL) {
        this.setLoopState(this.REPEATSTATE.SHUFFLE);
      } else if (this.loopState == this.REPEATSTATE.SHUFFLE) {
        this.setLoopState(this.REPEATSTATE.REPEAT_ONE);
      } else if (this.loopState == this.REPEATSTATE.REPEAT_ONE) {
        this.setLoopState(this.REPEATSTATE.REPEAT_ALL);
      }
    },
    ContainerClick: function () {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    afterVisibleChange(val) {
      console.log("visible", val);
    },
    SongProgressChange: function (e) {
      this.songProgress = e;
    },
  },
};
</script>

<style lang="scss" scoped>
.CustomAudio {
  width: 100%;
  height: 100%;
  .anticon {
    font-size: 17px;
  }
}

.lyric {
  height: 32px;
  .ant-space,
  .ant-space-item {
    height: 100%;
  }
  span {
    position: relative;
    top: -50%;
    margin: 0;
  }
}

.time {
  height: 32px;
  span {
    position: relative;
    top: -50%;
    margin: 0;
  }
}

.progressBar {
  width: 98%;
}

.soundSlider {
  width: 80px;
}
</style>
