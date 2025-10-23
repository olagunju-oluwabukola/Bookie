<template>
  <div :class="wrapperClass">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
      <span v-if="prefix" class="text-gray-500">{{ prefix }}</span>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        :placeholder="placeholder"
        class="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  disabled: Boolean,
  placeholder: String,
  prefix: String,
  wrapperClass: String
})

defineEmits(['update:modelValue'])
</script>
