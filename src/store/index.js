import Vue from 'vue';
import Vuex from 'vuex';
import mqtt from "mqtt";
Vue.use(Vuex);



const store = new Vuex.Store({
  state: {
    count: '00',
    allroom: '',
    portAddress: 'http://' + globalSetting.serverAdd,
    floor: "",
    multipleSelection: "",
    roommsg: "",
    selectedTypes: "",
    roomID: 'ttt',
    sblist: 'hhh',
    sbroom: '',
    active: 0,
    mqttSetting: {},
    client: mqtt.connect("ws://" + globalSetting.mqttAdd, {
		username: globalSetting.mqttId,
		password: globalSetting.mqttPwd,
		clientId: 'jtdz' + Math.round(Math.random() * 10000),
		clean: true,
	  }),
    kongtiao: '',
    userrank: '',
    mqttroom: '',
    mqttroom2: ''
  },
  mutations: {

    // changeportAddress(state, val) {
    //   state.portAddress = 'http://' + val + ':9000'
    // },
    changeCount(state, val) {
      state.count = val
    },
    changeallroom(state, val) {
      state.allroom = val
    },
    changeFloor(state, val) {
      state.floor = val
    },
    changemultipleSelection(state, val) {
      state.multipleSelection = val
    },
    changeselectedTypes(state, val) {
      state.selectedTypes = val
    },
    changeroomID(state, val) {
      state.roomID = val
    },
    changesblist(state, val) {
      state.sblist = val
    },
    changesbroom(state, val) {
      state.sbroom = val
    },
    changeactive(state, val) {
      state.active = val
    },
    changekongtiao(state, val) {
      state.kongtiao = val
    },
    changeuserrank(state, val) {
      state.userrank = val
    },
    changemqttroom(state, val) {
      state.mqttroom = val
    },
    changemqttroom2(state, val) {
      state.mqttroom2 = val
    }
  },
  getters: { //抛出数据的
  },
  action: {

  }
})

export default store
