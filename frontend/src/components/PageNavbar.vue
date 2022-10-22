<template>
  <header class="p-3 header page-navbar">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center"
      >
        Buzzard Battle
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export default defineComponent({
  setup() {
    console.log("A>AABBcc")
    const { loginWithRedirect, logout, user } = useAuth0();

    console.log(user.value.sub);

    return {
      login: () => {
        loginWithRedirect();
      },
      logout,
    };
  },
});
</script>

<style scoped>
.header {
  background-color: black;
  color: white;
  display: flex;
font-weight: 700;
font-family: 'nyt-karnakcondesed';
letter-spacing: 0.01em;
font-size: 32px;

}

.page-navbar {
  border-bottom: 1px solid white;
}
</style>
