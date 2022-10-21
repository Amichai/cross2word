<template>
  <div>
    <div>{{username}}</div>
    <a type="button" class="btn btn-primary" href="/deck">PLAY GAME!</a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export default defineComponent({
  components: {
  },

  props: {
  },

  emits: [],

  setup(props, { emit }) {
    const { logout, user } = useAuth0();
    console.log(user.value.sub);
    console.log(user.value.name);
    const username = ref(user.value.name)

    return {
      username,
    };
  },
});
</script>

<style>
</style>
