from abc import ABC, abstractmethod


class Runnable(ABC):
    """
    This can be used in single method class (e.g. service class that follow
    1-logic-1-service pattern)
    """

    @classmethod
    @abstractmethod
    def run(cls, **kwargs) -> object:
        pass
