<template lang="pug">
v-btn.btn(
  @click="click"
  :color='color'
  rounded='lg'
  variant='flat'
  :prepend-icon="prependIcon"
  :active='active'
  :height='height'
  :block='block')
  template(v-slot:default)
    span.text-primaryText.text-capitalize {{ text }}
</template>

<script setup lang="ts">
interface Props {
  click?: () => void;
  active?: boolean;
  color?: string;
  text?: string;
  prependIcon?: string;
  height?: string;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  click: () => {},
  active: false,
  color: '',
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
  border: 1px solid #D0D0D0
</style>
