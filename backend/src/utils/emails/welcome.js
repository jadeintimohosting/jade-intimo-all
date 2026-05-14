export const welcomeEmail = (email, name, phone, first_name, last_name) => {
    return `
    <!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bine ai venit la Jade Intimo</title>
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
                            <h2 style="margin-top: 0; color: #b56576; font-size: 24px; font-weight: 600;">Bine ai venit, ${name}!</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 20px;">
                                Ne bucurăm enorm să te avem alături. Contul tău pe <strong>Jade Intimo</strong> a fost creat cu succes!
                            </p>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px;">
                                De acum înainte, ai acces rapid la cele mai noi colecții, și te bucuri de un proces de finalizare și gestionare a comenzilor mult mai simplu și rapid. Fie că ești în căutarea unor piese delicate de lenjerie pentru ea, sau a confortului absolut pentru el, suntem aici să îți oferim calitate și rafinament.
                            </p>

                            <div style="background-color: #fdf6f7; padding: 20px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #fadadd;">
                                <p style="margin: 0 0 15px 0; font-size: 15px; color: #333333;"><strong>Detaliile contului tău:</strong></p>
                                <p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;"><strong>Prenume:</strong> ${first_name}</p>
                                <p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;"><strong>Nume de familie:</strong> ${last_name}</p>
                                <p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;"><strong>Email:</strong> ${email}</p>
                                <p style="margin: 0; font-size: 14px; color: #666666;"><strong>Telefon:</strong> ${phone}</p>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.jadeintimo.ro" style="display: inline-block; padding: 14px 30px; background-color: #b56576; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">Descoperă Colecțiile</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f9f9f9; padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #888888;">
                                Ai întrebări sau ai nevoie de ajutor? <br>
                                Contactează-ne oricând la <a href="mailto:contact@jadeintimo.ro" style="color: #b56576; text-decoration: none;">contact@jadeintimo.ro</a>.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                                &copy; 2026 Jade Intimo. Toate drepturile rezervate.<br>
                                Ai primit acest email deoarece te-ai înregistrat pe site-ul nostru.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};