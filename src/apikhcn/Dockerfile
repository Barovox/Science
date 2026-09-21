# ─── Stage 1: Build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

# Copy csproj và restore dependencies trước (tận dụng layer cache)
COPY QLKHCN_API/QLKHCN_API.csproj QLKHCN_API/
RUN dotnet restore QLKHCN_API/QLKHCN_API.csproj

# Copy toàn bộ source và build
COPY QLKHCN_API/ QLKHCN_API/
WORKDIR /src/QLKHCN_API
RUN dotnet publish QLKHCN_API.csproj -c Release -o /app/publish

# ─── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS runtime
WORKDIR /app

# Copy artifacts từ build stage
COPY --from=build /app/publish .

# Expose cổng HTTP
EXPOSE 80

ENTRYPOINT ["dotnet", "QLKHCN_API.dll"]
