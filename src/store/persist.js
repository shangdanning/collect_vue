import VuePersistence from "vuex-persist";

const persist = new VuePersistence({
  storage: window.sessionStorage
});

export default persist.plugin;
