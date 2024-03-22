<template lang="pug">
v-row(no-gutters).align-center.justify-space-between
  v-col(cols='3').d-flex.align-center.py-2.ms-4
    InputSearch(v-model='search' :placeholder='"search contacts"' :prependIcon='true' :clearable='clearable')
      v-icon(color='secondaryText') mdi-magnify

  v-col(cols='4').d-flex.align-center.py-2.justify-space-around
    v-row
      v-col.d-flex.align-center
        p
          span.text-primaryText select {{ Object.keys(selected).length }}
          span.text-secondaryText.ms-1 of {{ Object.keys(tableData).length }} customers

      v-col.me-7(style='min-width: 150px')
        Selector(
          :model-value="level"
          @update:modelValue='onLevelSelected'
          :items="levels"
          :disabled="disabled"
          placeholder="Change level"
          )
</template>

<script setup lang="ts">
import _ from 'lodash';
import type { ILevel, ICustomer } from '~/types/type';

interface Props {
  rawData: Record<string, ICustomer>;
  selected?: string[];
  level?: string;
}

const props = withDefaults(defineProps<Props>(), {
  rawData: () => ({}),
  selected: () => [],
  level: '',
});

const emit = defineEmits<{
  onSearched: [value: string];
  onLevelSelected: [value: string];
}>();

const tableData: Ref<Record<string, ICustomer>> = ref(props.rawData);

const levels: Ref<ILevel[]> = ref([
  { title: 'Premium', value: 'Premium' },
  { title: 'Gold', value: 'Gold' },
  { title: 'General', value: 'General' },
]);

const search = ref<string>('');

const clearable = ref<boolean>(true);

const disabled = computed<boolean>(() => {
  return props.selected.length === 0;
});

watch(search, (newValue: string) => {
  emit('onSearched', newValue);
});

const onLevelSelected = (value: string) => {
  emit('onLevelSelected', value);
};
</script>
~/types/type
