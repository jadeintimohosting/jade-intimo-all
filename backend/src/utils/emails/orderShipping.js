export const orderShipped = (first_name, last_name, orderId) => {
    return `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comanda ta a fost expediată - Jade Intimo</title>
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
                            <h2 style="margin-top: 0; color: #b56576; font-size: 24px; font-weight: 600;">Vești bune, ${first_name}!</h2>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; background-color: #fdf6f7; padding: 20px; border-radius: 50%; border: 2px solid #fadadd;">
                                    <span style="font-size: 30px;">📦</span>
                                </div>
                            </div>

                            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 20px; text-align: center;">
                                Comanda ta cu numărul <strong>#${orderId}</strong> a fost ambalată cu grijă, a plecat de la noi și a fost predată curierului.
                            </p>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; text-align: center;">
                                În scurt timp, vei primi un mesaj direct de la firma de curierat cu intervalul exact de livrare. Ne-am asigurat că produsele tale ajung la tine în cel mai scurt timp și în condiții perfecte.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.jadeintimo.ro/login" style="display: inline-block; padding: 14px 30px; background-color: #b56576; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">Vezi Comenzile Tale</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f9f9f9; padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #888888;">
                                Ai întrebări despre livrarea ta? <br>
                                Contactează-ne oricând la <a href="mailto:contact@jadeintimo.ro" style="color: #b56576; text-decoration: none;">contact@jadeintimo.ro</a>.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                                &copy; 2026 Jade Intimo. Toate drepturile rezervate.
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