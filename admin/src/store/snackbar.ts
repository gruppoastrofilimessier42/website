export const state = () => ({
  content: "",
  color: "",
});

export const mutations = {
  showMessage(state: any, payload: { content: string; color: string }) {
    state.content = payload.content;
    state.color = payload.color;
  },
};
