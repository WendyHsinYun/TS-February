<template lang="pug">
v-row(no-gutters).justify-center
  v-col.d-flex.align-center(cols="auto")
    span(v-if="customerTotal > 0").text-body-2.text-secondaryText.font-weight-bold ({{ pageStartIndex + 1 }}-{{ pageEndIndex }} / {{ customerTotal }})
    span(v-else).text-body-2.text-secondaryText.font-weight-bold (0 / {{ customerTotal }})

  v-col.d-flex.align-center.ms-4.me-6(cols="auto")
    v-pagination(
      :model-value="modelValue"
      @update:modelValue="onUpdated"
      :length="pageLength"
      :total-visible="pageTotalVisible"
      show-first-last-page
      first-icon="mdi-chevron-double-left"
      last-icon="mdi-chevron-double-right"
      density="compact"
      rounded="circle")

</template>

<script setup lang="ts">
interface Props {
  modelValue: number;
  pageSize?: number;
  customerTotal?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  pageSize: 5,
  customerTotal: 0,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const pageTotalVisible = ref<number>(7);

const pageStartIndex = computed<number>(() => {
  return (props.modelValue - 1) * props.pageSize;
});

const pageEndIndex = computed<number>(() => {
  return props.modelValue * props.pageSize > props.customerTotal
    ? props.customerTotal
    : props.modelValue * props.pageSize;
});

const pageLength = computed<number>(() => {
  return Math.ceil(props.customerTotal / props.pageSize);
});

const onUpdated = (value: number) => {
  emit('update:modelValue', value);
};
</script>

<style lang="sass" scoped>
:deep(.v-pagination > .v-pagination__list)
  .v-btn
    .v-btn__content
      font-size: 14px !important
</style>
