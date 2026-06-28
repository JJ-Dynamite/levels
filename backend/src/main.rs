use axum::{Router, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct CompareRequest { role: String, level: Option<String>, company: Option<String> }
#[derive(Serialize)]
struct SalaryData { role: String, level: String, company: String, base_salary: u32, equity: String, total_comp: u32 }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/health", axum::routing::get(health))
        .route("/compare", axum::routing::post(compare_salaries))
        .layer(tower_http::cors::CorsLayer::permissive());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    tracing::info!("levels backend running on :{}", port);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> { Json(serde_json::json!({"service": "levels", "status": "running"})) }
async fn health() -> Json<serde_json::Value> { Json(serde_json::json!({"status": "healthy"})) }

async fn compare_salaries(Json(req): Json<CompareRequest>) -> Json<serde_json::Value> {
    let level = req.level.unwrap_or_else(|| "Senior".into());
    let company = req.company.unwrap_or_else(|| "Tech Corp".into());
    let data = vec![
        SalaryData { role: req.role.clone(), level: level.clone(), company: company.clone(), base_salary: 180000, equity: "$50k/yr".into(), total_comp: 230000 },
        SalaryData { role: req.role.clone(), level: "Mid".into(), company: "Other Corp".into(), base_salary: 140000, equity: "$20k/yr".into(), total_comp: 160000 },
    ];
    Json(serde_json::json!({ "comparisons": data }))
}
