# Prime Innovation Network

Official website and learning portal for **Prime Innovation Network** / **Prime Digital Academy**.

## Run locally

### Backend (.NET API + Swagger)

```bash
cd backend/PrimeInnovation.Api
dotnet restore --configfile NuGet.Config
dotnet run
```

- API: http://localhost:5080  
- Swagger: http://localhost:5080/swagger  

### Frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173 (API URL via `VITE_API_URL` in `.env`).

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | alex@example.com | Student@123 |
| Instructor | ada@primedigitalacademy.com | Instructor@123 |

## Paystack

1. Get test keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
2. Set them in `backend/PrimeInnovation.Api/appsettings.json`:

```json
"Paystack": {
  "SecretKey": "sk_test_...",
  "PublicKey": "pk_test_..."
}
```

3. Restart the API, open a paid course, click **Pay with Paystack**
4. Use Paystack test card: `4084084084084081`, any future expiry, any CVV

## Documentation

Full technical docs (architecture, API reference, auth, deployment):

- [docs/TECHNICAL.md](docs/TECHNICAL.md)
- Swagger UI: http://localhost:5080/swagger

## Brand

- Primary: `#0B3C8A`
- Secondary: `#1FB6D9`
- Gold accent: `#F4B400`
