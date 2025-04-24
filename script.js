function generateSchedule() {
    const P = parseFloat(document.getElementById("amount").value); // Principal
    const annualRate = parseFloat(document.getElementById("rate").value);
    const n = parseInt(document.getElementById("months").value);
    const processingFee = parseFloat(document.getElementById("fee").value);
    const gstRate = 18;
  
    const transactionDate = new Date(document.getElementById("transactionDate").value);
    const dueDate = new Date(document.getElementById("dueDate").value);
    const daysBetween = Math.round((dueDate - transactionDate) / (1000 * 60 * 60 * 24));
  
    const r = annualRate / 12 / 100; // monthly interest rate
  
    // Base EMI (used for EMI 2 onward)
    const baseEMI = calculateEMI(P, r, n);
  
    let balance = P;
    let output = `
      <h2>Credit Card EMI Breakdown</h2>
      <table>
        <tr>
          <th>Month</th>
          <th>EMI (₹)</th>
          <th>Interest (₹)</th>
          <th>Principal (₹)</th>
          <th>Balance (₹)</th>
          <th>GST (₹)</th>
        </tr>
    `;
  
    let totalEMI = 0, totalInterest = 0, totalPrincipal = 0, totalTax = 0;
  
    for (let i = 1; i <= n; i++) {
      let interest, emi, principal, tax;
  
      if (i === 1) {
        // First EMI (pro-rata interest)
        const fullMonthInterest = balance * r;
        const adjustedInterest = (fullMonthInterest * daysBetween) / 30;
        emi = baseEMI - fullMonthInterest + adjustedInterest;
        interest = adjustedInterest;
        principal = emi - interest;
      } else {
        interest = balance * r;
        emi = baseEMI;
        principal = emi - interest;
      }
  
      tax = interest * gstRate / 100;
      balance -= principal;
  
      totalEMI += emi;
      totalInterest += interest;
      totalPrincipal += principal;
      totalTax += tax;
  
      output += `
        <tr>
          <td>${i}</td>
          <td>${emi.toFixed(2)}</td>
          <td>${interest.toFixed(2)}</td>
          <td>${principal.toFixed(2)}</td>
          <td>${balance < 1 ? '0.00' : balance.toFixed(2)}</td>
          <td>${tax.toFixed(2)}</td>
        </tr>
      `;
    }
  
    output += `</table>
      <h3>Summary</h3>
      <p><strong>Total EMI Paid:</strong> ₹${totalEMI.toFixed(2)}</p>
      <p><strong>Total Interest Paid:</strong> ₹${totalInterest.toFixed(2)}</p>
      <p><strong>Total GST on Interest (18%):</strong> ₹${totalTax.toFixed(2)}</p>
      <p><strong>Processing Fee:</strong> ₹${processingFee.toFixed(2)}</p>
      <p><strong>Total Amount Payable:</strong> ₹${(totalEMI + totalTax + processingFee).toFixed(2)}</p>
    `;
  
    document.getElementById("output").innerHTML = output;
  }
  
  function calculateEMI(P, r, n) {
    return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }
  