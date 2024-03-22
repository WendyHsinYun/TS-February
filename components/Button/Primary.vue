<template lang="pug">
v-btn.btn(
  @click="click"
  color='primary'
  rounded='lg'
  variant='flat'
  :prepend-icon="prependIcon"
  :active='active'
  :height='height'
  :block='block')
  template(v-slot:default)
    span.text-white.text-capitalize {{ text }}
</template>

<script setup lang="ts">
interface Props {
  click?: () => void;
  active?: boolean;
  text?: string;
  prependIcon?: string;
  height?: string;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  click: () => {},
  active: false,
  text: '',
  prependIcon: '',
  height: '40',
  block: false,
});
</script>

<style lang="sass" scoped>
.btn
  padding: 13px 25px
  font-size: 16px
  font-weight: 600
</style>
