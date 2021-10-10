import { requestUrl, request } from "@/utils/Http.js";

const AudioStore = {
  namespaced: true,
  state: {
    REPEATSTATE: {
      SHUFFLE: "shuffle",
      REPEAT_ONE: "repeat-one",
      REPEAT_ALL: "repeat-all",
    },
    PLAYSTATE: {
      NONE: "none",
      PLAY: "play",
      PAUSE: "pause",
    },
    playState: "",
    loopState: "",
    playIndex: 0,
    audio: {
      volume: 50,
      currentTime: 0,
      duration: 0,
      muted: false,
      shouldShowNativeControls: false,
      preload: false,
      autoplay: false,
      isPlaying: false,
      isLoading: false,
    },
    musicInfo: {
      artist: "", //歌手
      title: "", //标题
      src: "", //地址
      pic: "", //封面地址
      lrc: "", //歌词
      theme: "", //主题色
    },
    musicList: [],
  },
  mutations: {
    resetState(state) {
      state.playState = state.PLAYSTATE.NONE;
      state.loopState = state.REPEATSTATE.REPEAT_ALL;
      state.playIndex = 0;
      state.audio = {
        volume: 50,
        currentTime: 0,
        duration: 0,
        muted: false,
        shouldShowNativeControls: false,
        preload: false,
        autoplay: false,
        isPlaying: false,
        isLoading: false,
      };
      state.musicInfo = {
        artist: "", //歌手
        title: "", //标题
        src: "", //地址
        pic: "", //封面地址
        lrc: "", //歌词
        theme: "", //主题色
      };
      state.musicList = [];
    },
    setPlayState(state, payload) {
      state.playState = payload;
    },
    setLoopState(state, payload) {
      state.loopState = payload;
    },
    setPlayIndex(state, payload) {
      state.playIndex = payload;
    },
    setAudio(state, payload) {
      state.audio = payload;
    },
    setMusicInfo(state, payload) {
      state.musicInfo = payload;
    },
    setAudioByKey(state, payload) {
      for (var key in payload) {
        var item = payload[key];
        if (Object.prototype.hasOwnProperty.call(state.audio, key)) {
          state.audio[key] = item;
        }
      }
    },
    setMusicInfoByKey(state, payload) {
      for (var key in payload) {
        var item = payload[key];
        if (Object.prototype.hasOwnProperty.call(state.musicInfo, key)) {
          state.musicInfo[key] = item;
        }
      }
    },
    setMusicList(state, payload) {
      state.musicList = payload;
    },
    addMusicInToList(state, payload) {
      state.musicList.push(payload);
    },
  },
  actions: {
    setMusicListAction(context, payload) {
      return new Promise((resolve) => {
        request(requestUrl(payload, "get"), "get").then((response) => {
          // 2、处理正常的数据逻辑
          context.commit("setMusicList", response.data);
          resolve(response.data);
        });
      });
    },
  },
  getters: {
    getPrevPlayIndex(state) {
      var index = state.playIndex - 1;
      if (index < 0) {
        index = state.musicList.length - 1;
      }
      return index;
    },
    getNextPlayIndex(state) {
      var index = state.playIndex + 1;
      if (index >= state.musicList.length) {
        index = 0;
      }
      return index;
    },
    getPlayIndex(state) {
      var length = state.musicList.length;
      switch (state.loopState) {
        case state.REPEATSTATE.REPEAT_ALL:
          return state.playIndex + 1 >= length ? 0 : state.playIndex + 1;
        case state.REPEATSTATE.REPEAT_ONE:
          return state.playIndex;
        case state.REPEATSTATE.SHUFFLE:
          var index = Math.round(Math.random() * (length - 1));
          if (index == state.playIndex) {
            index++;
          }
          return index >= length ? 0 : index;
      }
    },
    getMusicInfo(state) {
      if (state.musicList.length == 0) {
        return null;
      }
      var musicInfo = state.musicList[state.playIndex];
      if (typeof musicInfo == "undefined") {
        return null;
      }
      return musicInfo;
    },
    getAudioByKey(state) {
      return function (key) {
        if (Object.prototype.hasOwnProperty.call(state.audio, key)) {
          return state.audio[key];
        }
      };
    },
    getMusicInfoByKey(state) {
      return function (key) {
        if (Object.prototype.hasOwnProperty.call(state.musicInfo, key)) {
          return state.musicInfo[key];
        }
      };
    },
    getMusicListByIndex(state) {
      return function (index) {
        if (typeof state.musicList[index] != "undefined") {
          return state.musicList[index];
        }
        return null;
      };
    },
    getCurrentTimeStr(state) {
      return function () {
        var value = state.audio.currentTime;
        var time = this.$moment.duration(value, "seconds");
        var hours = time.hours();
        var minutes = time.minutes();
        var seconds = time.seconds();
        if (hours == 0) {
          return this.$moment({
            h: hours,
            m: minutes,
            s: seconds,
          }).format("mm:ss");
        } else {
          return this.$moment({
            h: hours,
            m: minutes,
            s: seconds,
          }).format("HH:mm:ss");
        }
      };
    },
    getDurationStr(state) {
      return function () {
        var value = state.audio.duration;
        var time = this.$moment.duration(value, "seconds");
        var hours = time.hours();
        var minutes = time.minutes();
        var seconds = time.seconds();
        if (hours == 0) {
          return this.$moment({
            h: hours,
            m: minutes,
            s: seconds,
          }).format("mm:ss");
        } else {
          return this.$moment({
            h: hours,
            m: minutes,
            s: seconds,
          }).format("HH:mm:ss");
        }
      };
    },
  },
};

export default AudioStore;
