<template>
  <div>
    <p class="time">
      {{
        formatDistanceToNow(new Date(event.publishAt), {
          locale: dateFnsLocale?.value,
          addSuffix: true,
        }) || $t("Right now")
      }}
    </p>
    <EventCard :event="event" />
  </div>
</template>
<script lang="ts" setup>
import { IEvent } from "@/types/event.model";
import { formatDistanceToNow } from "date-fns";
import { inject, type Ref } from "vue";
import EventCard from "./EventCard.vue";
import type { Locale } from "date-fns";
defineProps<{
  event: IEvent;
}>();

const dateFnsLocale = inject<Ref<Locale>>("dateFnsLocale");
</script>
