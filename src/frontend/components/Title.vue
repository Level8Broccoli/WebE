<template>
  <header>
    <h1>Level <span>8</span> Game</h1>
    <small>by Thierry and Oliver</small>
  </header>
</template>

<style scoped>
header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}
small {
  font-weight: 300;
  color: #ff6464;
  text-align: center;
}
@media (min-width: 800px) {
  header {
    grid-template-columns: max-content 1fr;
    gap: 2.5rem;
  }

  small {
    text-align: left;
  }
}
</style>
