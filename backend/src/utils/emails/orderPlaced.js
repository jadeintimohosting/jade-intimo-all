export const orderPlaced = (email, phone, first_name, last_name, fullName, address_line, city, state, postal_code, country, total_ammount, shipping_cost, items, pm) => {
    
    // Determinăm metoda de plată
    const paymentMethod = pm==='cod' ? "Ramburs" : "Card de Credit";
    
    // Calculăm totalul general (Produse + Livrare)
    const grandTotal = (parseFloat(total_ammount) + parseFloat(shipping_cost)).toFixed(2);

    // Generăm HTML-ul pentru lista de produse
    const itemsHtml = items.map(item => `
        <tr>
            <td width="20%" style="padding: 15px 0; border-bottom: 1px solid #eeeeee;">
                <img src="${item.image}" alt="${item.productName}" style="width: 100%; max-width: 65px; border-radius: 4px; display: block; border: 1px solid #f0f0f0;">
            </td>
            <td width="55%" style="padding: 15px 15px; border-bottom: 1px solid #eeeeee; vertical-align: middle;">
                <p style="margin: 0; font-size: 15px; font-weight: 600; color: #333333;">${item.productName}</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #777777;">Mărime: <strong>${item.size}</strong> <br> Cantitate: <strong>${item.quantity}</strong></p>
            </td>
            <td width="25%" align="right" style="padding: 15px 0; border-bottom: 1px solid #eeeeee; vertical-align: middle;">
                <p style="margin: 0; font-size: 15px; font-weight: 600; color: #333333;">${((item.price/100) * item.quantity).toFixed(2)} RON</p>
            </td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmare Comandă - Jade Intimo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fcf8f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; -webkit-font-smoothing: antialiased;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fcf8f9; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 600px; width: 100%;">
                    
                    <tr>
                        <td align="center" style="padding: 40px 20px; background-color: #fadadd;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; letter-spacing: 2px; text-transform: uppercase;">Jade Intimo</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin-top: 0; color: #b56576; font-size: 24px; font-weight: 600;">Îți mulțumim pentru comandă, ${first_name}!</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px;">
                                Comanda ta a fost înregistrată cu succes și a intrat în procesare. Îți vom trimite un nou mesaj de îndată ce coletul este predat curierului.
                            </p>

                            <div style="background-color: #fdf6f7; padding: 20px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #fadadd;">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="50%" valign="top">
                                            <p style="margin: 0 0 10px 0; font-size: 15px; color: #b56576;"><strong>Adresa de livrare:</strong></p>
                                            <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.5;">
                                                ${fullName}<br>
                                                ${address_line}<br>
                                                ${city}, ${state}, ${postal_code}<br>
                                                ${country}
                                            </p>
                                        </td>
                                        <td width="50%" valign="top">
                                            <p style="margin: 0 0 10px 0; font-size: 15px; color: #b56576;"><strong>Detalii contact și plată:</strong></p>
                                            <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.5;">
                                                <strong>Telefon:</strong> ${phone}<br>
                                                <strong>Email:</strong> ${email}<br>
                                                <strong>Plată:</strong> ${paymentMethod}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333333; border-bottom: 2px solid #fadadd; padding-bottom: 10px;">Rezumatul Comenzii</h3>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                ${itemsHtml}
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="right" style="padding: 5px 0; font-size: 14px; color: #555555;">Subtotal produse:</td>
                                    <td align="right" width="100" style="padding: 5px 0; font-size: 14px; color: #333333;">${(parseFloat(total_ammount).toFixed(2))/100} RON</td>
                                </tr>
                                <tr>
                                    <td align="right" style="padding: 5px 0; font-size: 14px; color: #555555;">Cost livrare:</td>
                                    <td align="right" width="100" style="padding: 5px 0; font-size: 14px; color: #333333;">${(parseFloat(shipping_cost).toFixed(2))/100} RON</td>
                                </tr>
                                <tr>
                                    <td align="right" style="padding: 15px 0 0 0; font-size: 18px; font-weight: bold; color: #b56576;">Total:</td>
                                    <td align="right" width="100" style="padding: 15px 0 0 0; font-size: 18px; font-weight: bold; color: #b56576;">${grandTotal/100} RON</td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f9f9f9; padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #888888;">
                                Ai întrebări despre comanda ta? <br>
                                Contactează-ne oricând la <a href="mailto:contact@jadeintimo.ro" style="color: #b56576; text-decoration: none;">contact@jadeintimo.ro</a>.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                                &copy; 2026 Jade Intimo. Toate drepturile rezervate.<br>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};