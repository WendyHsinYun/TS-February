<template lang="pug">
v-row.mt-7.ml-6.justify-space-between
  v-col(cols='auto')
    span.header.font-weight-bold.text-primaryText Contacts
  v-col(cols='auto')
    v-row
      v-col(cols='auto' width='160px')
        ButtonSecondary(:click="exportFile" :text='"Export data"' color="background" :prependIcon='"mdi-export"' height='53')
      v-col(cols='auto' width='160px')
        ButtonPrimary(:text='"Add data"' :prependIcon='"mdi-plus"' height='53' )

v-row.ml-6
  v-col(cols='12')
    v-card(color="background" variant="outlined" style='border: 1px solid #D0D0D0')

      TableFilter(
        :level='level'
        :selected='selected'
        :rawData='tableData'
        @onSearched='onSearched'
        @onLevelSelected='onLevelSelected')

      Table(
        :rawData='tableData'
        v-model='selected'
        :selectAll='selectAll'
        :sortedColumn='sortedColumn'
        @onSelectAll='onSelectAll'
        @onSortColumn='sortTable'
        )

  v-col(cols='12')
    Pagination(
      v-model="page"
      :pageSize='pageSize'
      :customerTotal='customerTotal'
    )

PopupLevel(
  v-if='levelPopup'
  v-model='levelPopup'
  :selectedCustomers='selectedCustomers'
  :level='level'
  @submit='onLevelChanged'
  @close='close'
  )

</template>

<script setup lang="ts">
import _ from 'lodash';
import dayjs from 'dayjs';
import { utils, writeFileXLSX } from 'xlsx';

import type { IColumn, ICustomer } from '~/types/type';

const tableData = ref<Record<string, ICustomer>>(customersData);
const originalData = ref<Record<string, ICustomer>>(customersData);
const customerTotal = ref<number>(Object.keys(tableData.value).length);

const page = ref<number>(1);
const pageSize = ref<number>(6);

const level = ref<string>('');
const levelPopup = ref<boolean>(false);

const selected = ref<any[]>([]);
const selectAll = ref<boolean>(false);

const search = ref<string>('');
const searchResult = ref({});

const sortedColumn: Ref<IColumn> = ref({ column: '', order: 0 });

type Entry = [string, ICustomer];

const selectedCustomers = computed<string[]>(() => {
  const array = [];

  for (const [key, value] of Object.entries(originalData.value)) {
    if (selected.value.includes(key)) {
      array.push(value.name);
    }
  }

  return array;
});

const searchContact = (value: string) => {
  searchResult.value = {};

  const regex = new RegExp(value, 'i');

  for (const [entriesKey, entriesValue] of Object.entries(tableData.value)) {
    for (const [key, value] of Object.entries(entriesValue)) {
      const searchValue = [];

      if (key !== 'register' && key !== 'login') {
        searchValue.push(value);
      }

      const searchString = JSON.stringify([...searchValue]);

      if (regex.test(searchString)) {
        searchResult.value[entriesKey] = entriesValue;
      }
    }
  }

  tableData.value = searchResult.value;
};

const debounce = _.debounce((value: string) => {
  searchContact(value);
}, 500);

const getTableSlice = (page = 1) => {
  const startIndex = (page - 1) * pageSize.value;

  const endIndex =
    page * pageSize.value > customerTotal.value
      ? customerTotal.value
      : page * pageSize.value;

  const entries = Object.entries(originalData.value);
  const slicedTablaData = {};

  for (const [key, value] of entries.slice(startIndex, endIndex)) {
    slicedTablaData[key] = value;
  }

  tableData.value = slicedTablaData;
};

const sortNumber = ([, a]: Entry, [, b]: Entry) => {
  const order = sortedColumn.value.order;
  const col = sortedColumn.value.column;

  if (order === 1) {
    return Number(a[col]) - Number(b[col]);
  } else {
    return Number(b[col]) - Number(a[col]);
  }
};

const sortString = ([, a]: Entry, [, b]: Entry) => {
  const order = sortedColumn.value.order;
  const col = sortedColumn.value.column;

  if (order === 1) {
    return a[col].localeCompare(b[col]);
  } else {
    return b[col].localeCompare(a[col]);
  }
};

const sortTable = (col: string) => {
  if (sortedColumn.value.column === col) {
    sortedColumn.value.order = 1 - sortedColumn.value.order;
  } else {
    sortedColumn.value = { column: col, order: 0 };
  }

  // entries 是 Array<[string, ICustomer]> 類型
  const entries = Object.entries(originalData.value);

  if (col === 'name' || col === 'level') {
    entries.sort(sortString);
  } else {
    entries.sort(sortNumber);
  }

  originalData.value = Object.fromEntries(entries);
  getTableSlice(page.value);
};

const onSearched = (value: string) => {
  search.value = value;
};

const onLevelSelected = (value: string) => {
  level.value = value;
  levelPopup.value = true;
};

const onSelectAll = (newValue: boolean) => {
  selectAll.value = !selectAll.value;

  const tableKeys = Object.keys(tableData.value);

  selected.value = newValue
    ? _.union(selected.value, _.difference(tableKeys, selected.value))
    : _.difference(selected.value, tableKeys);
};

const isSelectAll = () => {
  return (
    _.intersection(selected.value, Object.keys(tableData.value)).length ===
    Object.keys(tableData.value).length
  );
};

const onLevelChanged = () => {
  const copies = { ...originalData.value };

  for (const [key, value] of Object.entries(copies)) {
    if (selected.value.includes(key)) {
      value.level = level.value;
    }
  }
  getTableSlice(page.value);

  levelPopup.value = false;
  level.value = '';
  selected.value = [];
};

const close = (event: Event) => {
  levelPopup.value = false;
  level.value = '';
};

const exportFile = () => {
  const copies = _.cloneDeep(originalData.value);
  const data = formatSheet(copies);

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();

  const now = dayjs().format('YYYY-MM-DD');

  utils.book_append_sheet(wb, ws, 'sheet1');
  writeFileXLSX(wb, `${now}_sheet.xlsx`);
};

watch(search, (newValue) => {
  if (newValue) {
    debounce(newValue);
  } else {
    debounce.cancel();
    getTableSlice();
  }
});

watch(selected, () => {
  selectAll.value = isSelectAll();
});

watch(page, (newValue) => {
  getTableSlice(newValue);
  selectAll.value = isSelectAll();
});

onMounted(() => {
  getTableSlice();
});
</script>

<style lang="sass">
.header
  font-size: 32px
</style>
