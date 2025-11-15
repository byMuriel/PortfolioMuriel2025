<template>
  <section class="container py-4" style="max-width: 520px">
    <h2 class="mb-3">Acceso Administrador</h2>

    <!-- Alert -->
    <div v-if="msg" class="alert" :class="ok ? 'alert-success' : 'alert-danger'" role="alert">
      {{ msg }}
    </div>

    <!-- Paso 1: usuario/clave -->
    <form class="card p-3 mb-3" v-if="step === 'userpass'" @submit.prevent="doLogin">
      <div class="mb-3">
        <label class="form-label">Usuario</label>
        <input v-model.trim="username" class="form-control" autocomplete="username" />
      </div>
      <!-- <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          autocomplete="current-password"
        />
      </div> -->
      <div class="input-group mb-3">
        <input
          :type="showPwd ? 'text' : 'password'"
          class="form-control"
          v-model.trim="password"
          autocomplete="current-password"
          required
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="showPwd = !showPwd"
          :aria-pressed="showPwd"
          :title="showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        >
          <i :class="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </div>
      <button class="btn btn-primary" type="submit" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
        Ingresar
      </button>
    </form>

    <!-- Paso 2: configurar 2FA (si no existía) -->
    <div class="card p-3 mb-3" v-if="step === 'setup'">
      <h5 class="mb-2">Configurar 2FA</h5>
      <p class="text-muted">Escanea este QR en Google Authenticator y luego ingresa el código.</p>
      <img :src="qr" alt="QR 2FA" class="mb-3" style="max-width: 200px" />
      <small class="text-muted d-block mb-3"><strong>Secreto:</strong> {{ secret }}</small>
      <form @submit.prevent="verify">
        <div class="mb-3">
          <label class="form-label">Código de 6 dígitos</label>
          <input v-model.trim="code" class="form-control" inputmode="numeric" maxlength="6" />
        </div>
        <button class="btn btn-success" type="submit" :disabled="loading || code.length < 6">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
          Verificar y entrar
        </button>
      </form>
    </div>

    <!-- Paso 2b: solo verificar 2FA (si ya existía) -->
    <div class="card p-3 mb-3" v-if="step === 'verify'">
      <h5 class="mb-2">Verificación 2FA</h5>
      <form @submit.prevent="verify">
        <div class="mb-3">
          <label class="form-label">Código de 6 dígitos</label>
          <input v-model.trim="code" class="form-control" inputmode="numeric" maxlength="6" />
        </div>
        <button class="btn btn-success" type="submit" :disabled="loading || code.length < 6">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
          Verificar y entrar
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authLogin, authTotpSetup, authVerifyTotp } from '@/services/auth'

const router = useRouter()

type Step = 'userpass' | 'setup' | 'verify'
const step = ref<Step>('userpass')

const username = ref('')
const password = ref('')
const showPwd = ref(false)
const code = ref('')

const loading = ref(false)
const ok = ref(false)
const msg = ref('')

const qr = ref('')
const secret = ref('')

async function doLogin() {
  loading.value = true
  msg.value = ''
  ok.value = false
  try {
    const data = await authLogin(username.value, password.value)
    if (data.needs_totp) {
      // Ya tenía 2FA -> solo verificar
      step.value = 'verify'
      msg.value = 'Ingrese su código 2FA.'
      ok.value = true
    } else {
      // No tenía 2FA -> configurar
      const s = await authTotpSetup()
      qr.value = s.qr
      secret.value = s.secret
      step.value = 'setup'
      msg.value = 'Escanee el QR y verifique el código.'
      ok.value = true
    }
  } catch (e: any) {
    msg.value = e?.message ?? 'Error en login'
    ok.value = false
  } finally {
    loading.value = false
  }
}

async function verify() {
  loading.value = true
  ok.value = false
  msg.value = ''
  try {
    await authVerifyTotp(code.value)
    ok.value = true
    msg.value = 'Autenticación completada'
    // Ir al panel
    const redirect = (router.currentRoute.value.query.r as string) || '/admin'
    router.push(redirect)
  } catch (e: any) {
    msg.value = e?.message ?? 'Código inválido'
    ok.value = false
  } finally {
    loading.value = false
  }
}
</script>
