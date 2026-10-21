#!/bin/bash
celery -A celery_app.celery_app worker --loglevel=info --without-mingle --without-gossip --without-heartbeat