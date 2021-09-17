<template>
	<div id="calculadora">
		<v-row>
			<v-col md="6" cols="12">
				<v-row>
					<v-col md="6" cols="6">
						<v-text-field v-money="money" v-model.lazy="txtSalarioBruto" label="Salário Bruto"></v-text-field>
					</v-col>
					<v-col md="3" cols="4">
						<v-text-field v-model="txtQtdDependentes" type="number" label="Qtd. Dependentes"></v-text-field>
					</v-col>
					<v-col md="3" cols="12" class="d-flex justify-center">
						<v-btn @click="calcular()" class="primary">Calcular</v-btn>
					</v-col>
				</v-row>
				<!-- <div class="d-flex justify-center">
					<v-btn @click="calcular()" class="primary">Calcular</v-btn>
				</div>-->
			</v-col>
			<v-col md="12" cols="12">
				<v-card class="pa-4">
					<v-row class="pt-2">
						<v-col md="7" class="font-weight-bold">Descrição</v-col>
						<v-col md="1" class="font-weight-bold">%</v-col>
						<v-col md="2" class="d-flex justify-end font-weight-bold">Provento</v-col>
						<v-col md="2" class="d-flex justify-end font-weight-bold">Desconto</v-col>
					</v-row>
					<v-row>
						<v-col md="7">Salário Bruto</v-col>
						<v-col md="1"></v-col>
						<v-col md="2" class="d-flex justify-end">{{vlrSalarioBruto | money}}</v-col>
						<v-col md="2" class="d-flex justify-end"></v-col>
					</v-row>
					<v-row>
						<v-col md="7">(-) INSS</v-col>
						<v-col md="1">{{percentualINSS | money}}</v-col>
						<v-col md="2" class="d-flex justify-end"></v-col>
						<v-col md="2" class="d-flex justify-end">{{vlrINSS | money}}</v-col>
					</v-row>
					<v-row>
						<v-col md="7">(-) IRRF</v-col>
						<v-col md="1">{{percentualIRRF | money}}</v-col>
						<v-col md="2" class="d-flex justify-end"></v-col>
						<v-col md="2" class="d-flex justify-end">{{vlrIRRF | money}}</v-col>
					</v-row>
					<v-divider class="my-4"></v-divider>
					<v-row class="font-weight-medium">
						<v-col md="7">(+) Proventos</v-col>
						<v-col md="1"></v-col>
						<v-col md="2" class="d-flex justify-end">{{vlrProventos | money}}</v-col>
						<v-col md="2" class="d-flex justify-end"></v-col>
					</v-row>
					<v-row class="font-weight-medium">
						<v-col md="7">(-) Descontos</v-col>
						<v-col md="1"></v-col>
						<v-col md="2" class="d-flex justify-end"></v-col>
						<v-col md="2" class="d-flex justify-end">{{vlrDescontos | money}}</v-col>
					</v-row>
					<v-divider class="my-2"></v-divider>
					<v-row class="font-weight-bold">
						<v-col md="7">Salário Líquido</v-col>
						<v-col md="1"></v-col>
						<v-col md="2" class="d-flex justify-end">{{vlrSalarioLiquido | money}}</v-col>
						<v-col md="2" class="d-flex justify-end"></v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { VMoney } from "v-money";
import { tabelaINSS, tetoINSS } from "@/js/tabelaINSS.js";
import { tabelaIRRF, deducaoDependente } from "@/js/tabelaIRRF.js";
import { formatarValorUSA, formatarValorBR } from "@/js/util.js";

export default {
	data() {
		return {
			txtSalarioBruto: 0,
			vlrSalarioBruto: 0,
			txtQtdDependentes: 0,
			vlrINSS: 0,
			vlrIRRF: 0,
			percentualINSS: 0,
			percentualIRRF: 0,
			money: {
				decimal: ",",
				thousands: ".",
				precision: 2,
			},
		};
	},
	methods: {
		calcularINSS(vlrSalarioBruto) {
			let vlrINSS = 0;
			let percentualINSS = 0;
			let salarioCalculado = 0;

			tabelaINSS.forEach((faixa) => {
				let baseCalculo = vlrSalarioBruto > faixa.ate ? faixa.ate : vlrSalarioBruto;
				baseCalculo = baseCalculo - salarioCalculado;
				salarioCalculado = salarioCalculado + baseCalculo;

				vlrINSS += (baseCalculo * faixa.percentual) / 100;
				percentualINSS = faixa.percentual;

				if (vlrSalarioBruto < faixa.ate) return false;
			});

			vlrINSS = vlrINSS > tetoINSS ? tetoINSS : vlrINSS;

			return { vlrINSS, percentualINSS };
		},
		calcularIRRF(vlrSalarioBruto, vlrINSS, qtdDependentes = 0) {
			let baseCalculo = vlrSalarioBruto - vlrINSS - qtdDependentes * deducaoDependente;
			let vlrIRRF = 0;
			let percentualIRRF = 0;

			tabelaIRRF.forEach((faixa) => {
				if (baseCalculo >= faixa.de && baseCalculo <= faixa.ate) {
					vlrIRRF = (baseCalculo * faixa.percentual) / 100 - faixa.deduzir;
					percentualIRRF = faixa.percentual;
					return false;
				}
			});

			return { vlrIRRF, percentualIRRF };
		},
		calcular() {
			this.vlrINSS = 0;
			this.vlrIRRF = 0;
			this.percentualINSS = 0;
			this.percentualIRRF = 0;
			this.salarioLiquido = 0;
			this.vlrSalarioBruto = formatarValorUSA(this.txtSalarioBruto);

			let inss = this.calcularINSS(this.vlrSalarioBruto);
			this.vlrINSS = inss.vlrINSS;
			this.percentualINSS = inss.percentualINSS;

			let irrf = this.calcularIRRF(this.vlrSalarioBruto, this.vlrINSS, this.txtQtdDependentes);
			this.vlrIRRF = irrf.vlrIRRF;

			this.percentualIRRF = irrf.percentualIRRF;
		},
	},
	computed: {
		vlrSalarioLiquido() {
			return this.vlrSalarioBruto - this.vlrINSS - this.vlrIRRF;
		},
		vlrProventos() {
			return this.vlrSalarioBruto;
		},
		vlrDescontos() {
			return this.vlrINSS + this.vlrIRRF;
		},
	},
	directives: { money: VMoney },
	filters: {
		money: function (value) {
			if (!value) return "-";
			return formatarValorBR(value);
		},
	},
};
</script>

<style lang="sass">
#calculadora
    margin: 0px 20px
    width: 100%
</style>