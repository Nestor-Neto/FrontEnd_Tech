<template>
  <v-card class="cryptocurrency-card">
    <v-card-title class="crypto-header">
      
      <div class="box-icon">
        <span :style="{ backgroundImage : 'url('+ iconUrl +')' }"></span>
      </div>
      <div class="crypto-title">
        <div class="crypto-name">{{ currency.name }}</div>
        <div class="crypto-symbol">{{ currency.symbol }}/USDT</div>
        <div class="crypto-price">{{ formatPrice(currency.price) }} <span class="usdt">USDT</span></div>
      </div>
    </v-card-title>
    
    <v-card-text>
      
      <v-row class="info-list" dense>
        <v-col cols="6" class="info-label">Variação 24h</v-col>
        <v-col cols="6" class="info-value">
          <span :class="getChangeClass(currency.percent_change_24h)">
            {{ formatChange(currency.percent_change_24h) }}%
          </span>
        </v-col>

        <v-col cols="6" class="info-label">Volume 24h</v-col>
        <v-col cols="6" class="info-value">
          ${{ formatPrice(currency.volume_24h) }}
        </v-col>

        <v-col cols="6" class="info-label">Market Cap</v-col>
        <v-col cols="6" class="info-value">
          ${{ formatPrice(currency.market_cap) }}
        </v-col>

        <v-col cols="6" class="info-label">Dominância</v-col>
        <v-col cols="6" class="info-value">
          {{ formatPercentage(currency.market_cap_dominance) }}%
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="success" class="btn-detalhes" @click="showDetails">
        DETALHES
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CryptocurrencyCard',
  
  props: {
    currency: {
      type: Object,
      required: true
    }
  },

  created () {
    console.log('Componente criado')
    console.log('Currency recebido:', this.currency)
  },

  computed: {
    iconUrl () {
      console.log('Método iconUrl chamado')
      console.log('Currency:', this.currency)
      return `https://s2.coinmarketcap.com/static/img/coins/64x64/${this.currency.id}.png`
    }
  },

  methods: {
    formatPrice (price) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    formatChange (change) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: 'always'
      }).format(change)
    },

    formatPercentage (value) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    },

    getChangeClass (change) {
      return {
        positive: change > 0,
        negative: change < 0
      }
    },

    showDetails () {
      console.log('Botão DETALHES clicado')
      console.log('Dados da moeda:', this.currency)
      try {
        if (!this.currency) {
          throw new Error('Dados da moeda não disponíveis')
        }
        this.$emit('show-details', { ...this.currency })
        console.log('Evento show-details emitido com sucesso')
      } catch (error) {
        console.error('Erro ao emitir evento show-details:', error)
      }
    }
  }
}
</script>

<style>
.cryptocurrency-card {
  height: 100%;
  padding: 20px 16px 16px 16px;
  box-sizing: border-box;
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-weight: 500;
}

.crypto-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 0;
  margin-bottom: 8px;
}

.box-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  margin-top: 2px;
}

.box-icon span {
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.crypto-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 2px;
}

.crypto-name {
  font-weight: 600;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.crypto-symbol {
  font-weight: 500;
  font-size: 1em;
  margin-bottom: 2px;
}

.crypto-price {
  font-size: 1.4em;
  font-weight: bold;
  margin-top: 4px;
  margin-bottom: 0;
}

.v-card-text {
  margin-top: 10px;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.info-list {
  margin-top: 8px;
}

.info-label {
  font-weight: 600;
  color: #333;
  text-align: left;
  padding: 4px 0;
  font-size: 1.1em;
}

.info-value {
  text-align: right;
  padding: 4px 0;
  font-size: 1.15em;
  font-weight: 500;
}

.v-card-actions {
  margin-top: 8px;
  padding-bottom: 0;
}

.v-btn {
  margin-top: 8px;
}

.price {
  font-size: 1.5em;
  font-weight: bold;
  margin: 10px 0;
}

.positive {
  color: #4caf50 !important;
}

.negative {
  color: red !important;
}

.usdt {
  font-size: 0.8em;
  color: #888;
}

.btn-detalhes {
  font-size: 1.1em;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #43a047 !important;
  min-width: unset;
  padding: 0 8px;
  float: right;
  background: transparent !important;
  box-shadow: none !important;
}
</style> 