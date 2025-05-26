<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              class="elevation-1"
              loading-text="Carregando usuários..."
              no-data-text="Nenhum usuário encontrado."
            >
              <template #[`item.name`]="{ item }">
                {{ item.name }}
              </template>
              <template #[`item.email`]="{ item }">
                {{ item.email }}
              </template>
              <template #[`item.item_actions`]="{ item }">
                <div class="action-icons">
                  <v-icon
                    color="primary"
                    @click="viewUserProfile(item)"
                    class="action-icon view"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                    color="error"
                    @click="confirmDelete(item)"
                    class="action-icon delete"
                  >
                    mdi-delete
                  </v-icon>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="500" persistent>
      <v-card>
        <div style="height: 50px; background: #DD4b39; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
        <v-card-title class="text-h5 font-weight-bold grey--text text--darken-3" style="justify-content: center;">
          Confirmar Exclusão
        </v-card-title>
        <v-card-text class="text-body-1" style="text-align: center;">
          Tem certeza que deseja excluir o usuário <b>{{ userToDelete?.name }}</b>?
        </v-card-text>
        <v-card-actions style="justify-content: flex-end;">
          <v-btn
            color="grey"
            text
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            text
            class="font-weight-bold"
            @click="deleteUser"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const UserService = require('@/services/UserService.js')

export default {
  name: 'UsersList',
  data () {
    return {
      users: [],
      loading: false,
      deleteDialog: false,
      userToDelete: null,
      headers: [
        { text: 'Nome', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: '', value: 'item_actions', sortable: false }
      ]
    }
  },
  mounted () {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers () {
      this.loading = true
      try {
        this.users = await UserService.getAllUsers()
      } catch (e) {
        this.users = []
      } finally {
        this.loading = false
      }
    },
    viewUserProfile (user) {
      this.$router.push({
        path: '/pages/user',
        query: { user: JSON.stringify(user) }
      })
    },
    confirmDelete (user) {
      this.userToDelete = user
      this.deleteDialog = true
    },
    async deleteUser () {
      try {
        await UserService.deleteUser(this.userToDelete.id)
        this.deleteDialog = false
        this.userToDelete = null
        await this.fetchUsers() // Recarrega a lista de usuários
        this.$root.$emit('show-notification', {
          type: 'success',
          message: 'Usuário excluído com sucesso!'
        })
      } catch (error) {
        this.$root.$emit('show-notification', {
          type: 'error',
          message: 'Erro ao excluir usuário. Por favor, tente novamente.'
        })
      }
    }
  }
}
</script>

<style scoped>
.description-cell {
  display: block;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep td[data-test-description] {
  max-width: 10px !important;
  width: 10px !important;
  min-width: 120px;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.action-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}
.action-icon {
  font-size: 28px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  border-radius: 50%;
  padding: 6px;
}
.action-icon.view:hover {
  background: #e3f2fd;
  color: #1976d2;
}
.action-icon.delete:hover {
  background: #ffebee;
  color: #b71c1c;
}

::v-deep .v-data-table th,
::v-deep .v-data-table td {
  font-size: 18px !important;
  color: #111 !important;
}

::v-deep .v-data-table th {
  font-weight: bold !important;
}
</style> 