<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Criptomoedas</h1>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert
          type="error"
          text
        >
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="crypto in cryptocurrencies"
        :key="crypto.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <cryptocurrency-card
          :currency="formatCurrency(crypto)"
          @show-details="handleShowDetails"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="650" persistent @click:outside="dialog = false">
      <v-card v-if="selectedCurrency">
        <v-card-title>
          <div class="header">
            <span class="icon" :style="{ backgroundImage: 'url(' + iconUrl + ')' }"></span>
            <div>
              <div class="name">{{ selectedCurrency.name }} ({{ selectedCurrency.symbol }})</div>
              <div class="price"> {{ formatPrice(selectedCurrency.price) }} USDT</div>
            </div>
            <v-spacer />
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div class="section-highlight">Variações</div>
          <v-row>
            <v-col v-for="(label, key) in variations" :key="key">
              <div class="section-highlight-label">{{ label }}</div>
              <div :class="['section-highlight-value', getChangeClass(selectedCurrency[key])]">{{ formatChange(selectedCurrency[key]) }}%</div>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="section-highlight">Informações Gerais</div>
          <div class="info-list-compact">
            <div class="info-row">
              <span class="section-highlight-label">Volume 24h</span>
              <span class="section-highlight-value">${{ formatPrice(selectedCurrency.volume_24h) }}</span>
            </div>
            <div class="info-row">
              <span class="section-highlight-label">Variação Volume 24h</span>
              <span class="section-highlight-value">{{ formatChange(selectedCurrency.volume_change_24h) }}%</span>
            </div>
            <div class="info-row">
              <span class="section-highlight-label">Market Cap</span>
              <span class="section-highlight-value">${{ formatPrice(selectedCurrency.market_cap) }}</span>
            </div>
            <div class="info-row">
              <span class="section-highlight-label">Market Cap Total</span>
              <span class="section-highlight-value">${{ formatPrice(selectedCurrency.fully_diluted_market_cap) }}</span>
            </div>
            <div class="info-row">
              <span class="section-highlight-label">Dominância</span>
              <span class="section-highlight-value">{{ formatPercentage(selectedCurrency.market_cap_dominance) }}%</span>
            </div>
            <div class="info-row">
              <span class="section-highlight-label">Última Atualização</span>
              <span class="section-highlight-value">{{ new Date(selectedCurrency.last_updated).toLocaleString('pt-BR') }}</span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="modal-actions">
          <v-spacer />
          <v-btn class="btn-fechar" @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { coinmarketcapService } from '@/services/coinmarketcap.service'
import CryptocurrencyCard from '@/components/CryptocurrencyCard.vue'

export default {
  name: 'Dashboard',

  components: {
    CryptocurrencyCard
  },

  data: () => ({
    cryptocurrencies: [],
    loading: true,
    error: null,
    dialog: false,
    selectedCurrency: null,
    iconUrl: '',
    variations: {
      percent_change_1h: '1h',
      percent_change_24h: '24h',
      percent_change_7d: '7d',
      percent_change_30d: '30d',
      percent_change_60d: '60d',
      percent_change_90d: '90d'
    }
  }),

  async created () {
    try {
      const response = await coinmarketcapService.getCryptocurrencies()
      this.cryptocurrencies = response.data
    } catch (error) {
      this.error = 'Erro ao carregar criptomoedas'
      console.error(error)
    } finally {
      this.loading = false
    }
  },

  methods: {
    formatCurrency (crypto) {
      console.log('Dados recebidos no formatCurrency:', crypto)
      try {
        if (!crypto || !crypto.quote || !crypto.quote.USD) {
          throw new Error('Estrutura de dados inválida')
        }

        const formatted = {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          slug: crypto.slug,
          price: crypto.quote.USD.price,
          volume_24h: crypto.quote.USD.volume_24h,
          volume_change_24h: crypto.quote.USD.volume_change_24h,
          percent_change_1h: crypto.quote.USD.percent_change_1h,
          percent_change_24h: crypto.quote.USD.percent_change_24h,
          percent_change_7d: crypto.quote.USD.percent_change_7d,
          percent_change_30d: crypto.quote.USD.percent_change_30d,
          percent_change_60d: crypto.quote.USD.percent_change_60d,
          percent_change_90d: crypto.quote.USD.percent_change_90d,
          market_cap: crypto.quote.USD.market_cap,
          market_cap_dominance: crypto.quote.USD.market_cap_dominance,
          fully_diluted_market_cap: crypto.quote.USD.fully_diluted_market_cap,
          last_updated: crypto.quote.USD.last_updated
        }

        console.log('Dados formatados:', formatted)
        return formatted
      } catch (error) {
        console.error('Erro ao formatar dados da moeda:', error)
        return null
      }
    },

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

    handleShowDetails (currency) {
      console.log('Evento show-details recebido no Dashboard')
      console.log('Dados da moeda recebidos:', currency)
      try {
        if (!currency) {
          throw new Error('Dados da moeda não disponíveis')
        }
        this.selectedCurrency = { ...currency }
        console.log('selectedCurrency atualizado:', this.selectedCurrency)
        this.dialog = true
        console.log('Dialog aberto:', this.dialog)
        this.iconUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png`
      } catch (error) {
        console.error('Erro ao mostrar detalhes:', error)
        this.error = 'Erro ao mostrar detalhes da moeda'
      }
    }
  }
}
</script>

<style>
.info-list-compact {
  display: flex;
  flex-direction: column;
  gap: 2px; /* Espaço mínimo entre as linhas */
  margin-bottom: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05em;
  padding: 1px 0; /* Espaço entre o label e o valor */
}

.section-highlight {
  font-weight: 600;
  font-size: 1.18em;
  color: #222;
  margin-bottom: 6px;
  margin-top: 10px;
}
.section-highlight-label {
  font-weight: 500;
  color: #333;
  font-size: 1.08em;
}
.section-highlight-value {
  font-weight: 600;
  font-size: 1.08em;
  color: #222;
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: inline-block;
  margin-right: 16px;
  background-color: #eee; /* fallback caso a imagem não carregue */
}

.modal-actions {
  justify-content: flex-end;
  padding-right: 16px;
}
.btn-fechar {
  font-size: 1.1em;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: red !important;
  min-width: unset;
  padding: 0 8px;
  float: right;
  background: transparent !important;
  box-shadow: none !important;
}
</style>
