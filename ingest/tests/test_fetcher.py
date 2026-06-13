import time

from ingest.fetcher import Fetcher


def test_rate_limiter_delays_same_host(monkeypatch):
    slept = []
    monkeypatch.setattr(time, "sleep", lambda s: slept.append(s))

    f = Fetcher()
    f._wait("seecs.nust.edu.pk")
    f._wait("seecs.nust.edu.pk")

    assert len(slept) == 1
    assert slept[0] > 0


def test_rate_limiter_does_not_delay_different_hosts(monkeypatch):
    slept = []
    monkeypatch.setattr(time, "sleep", lambda s: slept.append(s))

    f = Fetcher()
    f._wait("seecs.nust.edu.pk")
    f._wait("smme.nust.edu.pk")

    assert slept == []
