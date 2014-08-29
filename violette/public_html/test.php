<?php
    class Foo
{
    public $a = "I'm a!";
    public $b = "I'm b!";
    public $c;
    
    public function getB() {
        return $this->b;
    }
    
    public function setC($c) {
        $this->c = $c;
        return $this;
    }
    
    public function getC() {
        return $this->c;
    }
}

    $bar = new foo;
    $bar1 = new foo;
    $bar2 = new foo;
    $bar3 = new foo;
    $bar4 = new foo;
    
    $bars = array($bar,$bar1,$bar2,$bar3,$bar4);
    echo serialize($bar);
    echo "<br>";
    echo base64_encode(serialize($bar));
    echo "<br>";
    echo 'json foo: '.json_encode($bars);
    
    echo "<br>";
    echo "<br>";
    
    foreach ($bars as $key => $value) {
        echo 'foo# '.$key;
        echo "<br>";
        echo 'A: '.$value->a;
        echo "<br>";
        echo 'B: '.$value->b;
        echo "<br>";
        echo 'C: '.$value->c;
        echo "<br>";
        echo "<br>";
}
    
?>