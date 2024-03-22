<template lang="pug">
v-select(
  :model-value="modelValue"
  @update:modelValue="onUpdated"
  :items="items"
  :disabled='disabled'
  :clearable="clearable"
  color="primaryText"
  rounded="lg"
  density='compact'
  variant='outlined'
  single-line
  hide-details)
  template(v-slot:label)
    span {{ placeholder }}

  template(v-slot:selection="{ item }")
    span.text-body-2.text-primaryText.font-weight-medium {{ item.title }}

  template(v-slot:item="{ props, item }")
    v-list-item.listItem(v-bind="props" :title="item.title" color="primaryText")
      template(v-slot:title="{ title }")
        span.text-body-2.text-primaryText.font-weight-medium {{ title }}

</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  items: any[];
  disabled: boolean;
  rules?: any[];
  placeholder?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  items: () => [],
  disabled: false,
  rules: () => [],
  placeholder: '',
  clearable: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const onUpdated = (value: string) => {
  emit('update:modelValue', value);
};
</script>

<style lang="sass" scoped>
.v-input
  color: $primaryText
.v-list-item
  border-radius: 4px

.listItem
  padding: 5px 8px !important
  min-height: 36px
  margin: 4px

:deep(.mdi-close-circle)
  font-size: 18px
  color: $primaryText
</style>
