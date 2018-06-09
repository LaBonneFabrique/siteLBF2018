<template>
  <div class="formDate">
    <q-btn color="primary" flat dense @click="openChoixDate = true">Ajouter des dates</q-btn>
    <q-modal v-model="openChoixDate" minimized :content-css="{padding: '20px'}">
  <q-field
    icon="fa-calendar"
    label="Choisir la ou les dates"
    />
    <q-datetime-picker color="secondary" v-model="datePickup" type="date" @input="val => { addDate(val) }" :min="aujourdhui" :first-day-of-week="1"/>
    <br />
    <q-btn v-if="afficheBtn" color="amber" flat @click="forceAjout()">Ajouter cette sélection</q-btn>
      <div class="group">
      <q-chip v-for="(creneau, index) in listeDates" :key="toTimeStamp(creneau.date)" closable square color="primary" @hide="removeDateBis(index)">
        {{toDateReadable(creneau.date)}}
      </q-chip>
      </div>
      <div class="row justify-center" style="margin-top: 10px">
      <q-btn color="primary" flat @click="openChoixDate = false" clas="col-m-2">Valider</q-btn>
      </div>
</q-modal>
  </div>
</template>

<script>
import { date } from 'quasar'
import { DAYNAMES, MONTHNAMES } from '../constants/date-fr'

const today = new Date()

export default {
  components: {
  },
  props: ['propDates'],
  data () {
    return {
      datePickup: today,
      joursFR: DAYNAMES,
      moisFR: MONTHNAMES,
      listeDates: [],
      aujourdhui: today,
      lastDatePickup: today,
      afficheBtn: false,
      openChoixDate: false
    }
  },
  mounted: function () {
    this.listeDates = this.propDates
    console.log('els dates', this.propDates)
  },
  methods: {
    removeDateBis (index) {
      this.$emit('remove', index)
    },
    removeDate: function (index) {
      this.listeDates.splice(index, 1)
      this.$emit('listeDates', this.listeDates)
    },
    addDate: function (selectedDate) {
      let unit = 'months'
      let diff = date.getDateDiff(this.datePickup, this.lastDatePickup, unit)
      this.lastDatePickup = this.datePickup
      if (diff !== 1 && diff !== -1) {
        this.listeDates.push({date: this.datePickup})
        this.listeDates.sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime() })
        this.$emit('listeDates', this.listeDates)
        this.afficheBtn = false
      } else {
        this.afficheBtn = true
      }
      console.log(this.listeDates)
    },
    toTimeStamp: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'X').toString() + Math.random().toString(2)
    },
    toDateReadable: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'dddd DD MMMM', {dayNames: DAYNAMES, monthNames: MONTHNAMES})
    },
    forceAjout: function () {
      this.lastDatePickup = this.datePickup
      this.listeDates.push(this.datePickup)
      this.afficheBtn = false
      this.$emit('listeDates', this.listeDates)
    }
  }
}
</script>

<style>
.formDate {
    width: 100%;
    max-width: 400px;
  }
</style>
