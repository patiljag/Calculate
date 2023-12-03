new Vue({
    el: '#app',
    data: {
      loanAmount: null,
      interestRate: null,
      loanTerm: null,
      emi: null,
      totalInterest: null,
      totalPayable: null,
      amortizationSchedule: []
    },
    methods: {
      calculateEMI() {
        const principal = parseFloat(this.loanAmount);
        const rateOfInterest = parseFloat(this.interestRate) / 100 / 12;
        const numberOfPayments = parseFloat(this.loanTerm);
  
        const emi =
          (principal * rateOfInterest * Math.pow(1 + rateOfInterest, numberOfPayments)) /
          (Math.pow(1 + rateOfInterest, numberOfPayments) - 1);
  
        this.emi = emi;
        this.calculateAmortizationSchedule(principal, rateOfInterest, numberOfPayments);
        this.calculateTotalInterest();
        this.calculateTotalPayable();
        this.generatePieChart();
      },
      calculateAmortizationSchedule(principal, rateOfInterest, numberOfPayments) {
        this.amortizationSchedule = [];
        let balance = principal;
  
        for (let i = 1; i <= numberOfPayments; i++) {
          const interest = balance * rateOfInterest;
          const principalPayment = this.emi - interest;
  
          this.amortizationSchedule.push({
            paymentNumber: i,
            emi: this.emi,
            principal: principalPayment,
            interest: interest,
            balance: balance -= principalPayment
          });
        }
      },
      calculateTotalInterest() {
        this.totalInterest = this.amortizationSchedule.reduce((sum, payment) => sum + payment.interest, 0);
      },
      calculateTotalPayable() {
        this.totalPayable = this.totalInterest + parseFloat(this.loanAmount);
      },
      generatePieChart() {
        const ctx = document.getElementById('pieChart').getContext('2d');
        const labels = ['Principal', 'Interest'];
        const data = [parseFloat(this.loanAmount), this.totalInterest];
        const colors = ['#36a2eb', '#ff6384'];
  
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: colors
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
  });
  