FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./backend
COPY frontend ./frontend
RUN useradd --create-home --uid 10001 appuser && mkdir -p /data && chown -R appuser:appuser /app /data
USER appuser
ENV AZENTIO_DB_PATH=/data/azentio.db
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=4s --start-period=20s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health',timeout=3)" || exit 1
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
