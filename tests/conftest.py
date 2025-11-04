import os
import shutil
import tempfile

import pytest

from app import create_app
from app.database import db


@pytest.fixture(scope="session")
def app():
    # Create a temporary instance folder for the SQLite DB used by create_app
    temp_instance_dir = tempfile.mkdtemp(prefix="flask_instance_")

    os.environ["FLASK_ENV"] = "testing"

    app = create_app()

    # Point Flask instance path to the temp dir so DB is isolated
    app.instance_path = temp_instance_dir

    with app.app_context():
        # Recreate tables to ensure a clean slate
        db.drop_all()
        db.create_all()

    yield app

    # Cleanup temp instance directory
    shutil.rmtree(temp_instance_dir, ignore_errors=True)


@pytest.fixture()
def client(app):
    return app.test_client()
