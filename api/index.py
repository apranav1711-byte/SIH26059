"""Vercel entrypoint using the same handler as the local prototype."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"SIH26059"))
from app import Handler

class handler(Handler):
    pass
